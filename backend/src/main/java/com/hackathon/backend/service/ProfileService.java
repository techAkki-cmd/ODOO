package com.hackathon.backend.service;

import com.hackathon.backend.dto.*;
import com.hackathon.backend.entity.*;
import com.hackathon.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ConnectionRequestRepository connectionRequestRepository;

    private static final String UPLOAD_DIR = "uploads/profile-photos/";

    @Transactional(readOnly = true)
    public ProfileSearchResponse searchProfiles(String search, Availability availability, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("averageRating").descending());

            Page<User> userPage;
            if ((search == null || search.trim().isEmpty()) && availability == null) {
                userPage = userRepository.findPublicProfiles(pageable);
            } else {
                userPage = userRepository.searchProfiles(search, availability, pageable);
            }

            Page<UserProfileDTO> profilePage = userPage.map(this::convertToProfileDTO);
            return new ProfileSearchResponse(profilePage);
        } catch (Exception e) {
            System.err.println("Error searching profiles: " + e.getMessage());
            Page<UserProfileDTO> emptyPage = Page.empty();
            return new ProfileSearchResponse(emptyPage);
        }
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getPublicProfile(Long userId) {
        try {
            return userRepository.findById(userId)
                    .filter(user -> user.getIsProfilePublic() && user.getActive() && user.getEmailVerified())
                    .map(this::convertToProfileDTO)
                    .orElse(null);
        } catch (Exception e) {
            System.err.println("Error getting public profile: " + e.getMessage());
            return null;
        }
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUserProfile(String email) {
        try {
            return userRepository.findByEmailAndActiveTrue(email)
                    .map(this::convertToProfileDTO)
                    .orElse(null);
        } catch (Exception e) {
            System.err.println("Error getting current user profile: " + e.getMessage());
            return null;
        }
    }

    @Transactional(readOnly = true)
    public PlatformStatsDTO getPlatformStats() {
        try {
            Long activeMembers = userRepository.countActiveUsers();
            Long successfulMatches = connectionRequestRepository.countSuccessfulConnections();
            Long totalSkillsOffered = skillRepository.countOfferedSkills();
            Long totalRequests = connectionRequestRepository.count();

            return new PlatformStatsDTO(
                    activeMembers != null ? activeMembers : 0L,
                    successfulMatches != null ? successfulMatches : 0L,
                    totalSkillsOffered != null ? totalSkillsOffered : 0L,
                    totalRequests != null ? totalRequests : 0L
            );
        } catch (Exception e) {
            System.err.println("Error getting platform stats: " + e.getMessage());
            return new PlatformStatsDTO(0L, 0L, 0L, 0L);
        }
    }

    public ApiResponse updateUserProfile(String email, UpdateProfileRequest request) {
        try {
            User user = userRepository.findByEmailAndActiveTrue(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update fields if provided
            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio());
            }
            if (request.getLocation() != null) {
                user.setLocation(request.getLocation());
            }
            if (request.getIsProfilePublic() != null) {
                user.setIsProfilePublic(request.getIsProfilePublic());
            }
            if (request.getAvailability() != null) {
                user.setAvailability(request.getAvailability());
            }

            userRepository.save(user);
            return new ApiResponse(true, "Profile updated successfully");

        } catch (Exception e) {
            return new ApiResponse(false, "Failed to update profile: " + e.getMessage());
        }
    }

    public ApiResponse updateUserSkills(String email, UpdateSkillsRequest request) {
        try {
            User user = userRepository.findByEmailAndActiveTrue(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Remove existing skills
            userSkillRepository.deleteByUserAndType(user, UserSkill.SkillType.OFFERED);
            userSkillRepository.deleteByUserAndType(user, UserSkill.SkillType.WANTED);

            // Add offered skills
            for (String skillName : request.getSkillsOffered()) {
                Skill skill = getOrCreateSkill(skillName);
                UserSkill userSkill = new UserSkill(user, skill, UserSkill.SkillType.OFFERED, 3);
                userSkillRepository.save(userSkill);
            }

            // Add wanted skills
            for (String skillName : request.getSkillsWanted()) {
                Skill skill = getOrCreateSkill(skillName);
                UserSkill userSkill = new UserSkill(user, skill, UserSkill.SkillType.WANTED, 1);
                userSkillRepository.save(userSkill);
            }

            return new ApiResponse(true, "Skills updated successfully");

        } catch (Exception e) {
            return new ApiResponse(false, "Failed to update skills: " + e.getMessage());
        }
    }

    public ApiResponse updateProfilePhoto(String email, MultipartFile photo) {
        try {
            User user = userRepository.findByEmailAndActiveTrue(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate file
            if (photo.isEmpty()) {
                return new ApiResponse(false, "Please select a file");
            }

            // Check file size (max 5MB)
            if (photo.getSize() > 5 * 1024 * 1024) {
                return new ApiResponse(false, "File size must be less than 5MB");
            }

            // Check file type
            String contentType = photo.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return new ApiResponse(false, "Please upload a valid image file");
            }

            // Generate unique filename
            String originalFilename = photo.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(photo.getInputStream(), filePath);

            // Update user profile photo URL
            String photoUrl = "/uploads/profile-photos/" + filename;
            user.setProfilePhoto(photoUrl);
            userRepository.save(user);

            return new ApiResponse(true, "Profile photo updated successfully");

        } catch (IOException e) {
            return new ApiResponse(false, "Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to update profile photo: " + e.getMessage());
        }
    }

    private UserProfileDTO convertToProfileDTO(User user) {
        if (user == null) {
            return null;
        }

        UserProfileDTO dto = new UserProfileDTO();

        // Basic user information
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName() != null ? user.getFirstName() : "");
        dto.setLastName(user.getLastName() != null ? user.getLastName() : "");
        dto.setProfilePhoto(user.getProfilePhoto());
        dto.setLocation(user.getLocation());
        dto.setBio(user.getBio());

        // Rating and performance metrics
        dto.setAverageRating(user.getAverageRating() != null ? user.getAverageRating() : 0.0);
        dto.setTotalReviews(user.getTotalReviews() != null ? user.getTotalReviews() : 0);
        dto.setCompletedSwaps(user.getCompletedSwaps() != null ? user.getCompletedSwaps() : 0);

        // Availability
        dto.setAvailability(user.getAvailability() != null ? user.getAvailability() : Availability.FLEXIBLE);

        // Load and set skills with error handling
        try {
            // Get offered skills
            List<String> skillsOffered = userSkillRepository
                    .findByUserAndType(user, UserSkill.SkillType.OFFERED)
                    .stream()
                    .map(us -> us.getSkill() != null ? us.getSkill().getName() : null)
                    .filter(skillName -> skillName != null && !skillName.isEmpty())
                    .collect(Collectors.toList());
            dto.setSkillsOffered(skillsOffered);

            // Get wanted skills
            List<String> skillsWanted = userSkillRepository
                    .findByUserAndType(user, UserSkill.SkillType.WANTED)
                    .stream()
                    .map(us -> us.getSkill() != null ? us.getSkill().getName() : null)
                    .filter(skillName -> skillName != null && !skillName.isEmpty())
                    .collect(Collectors.toList());
            dto.setSkillsWanted(skillsWanted);

        } catch (Exception e) {
            System.err.println("Error loading skills for user " + user.getId() + ": " + e.getMessage());
            // Set empty lists as fallback
            dto.setSkillsOffered(List.of());
            dto.setSkillsWanted(List.of());
        }

        return dto;
    }

    private Skill getOrCreateSkill(String skillName) {
        Optional<Skill> existingSkill = skillRepository.findByNameIgnoreCase(skillName);
        if (existingSkill.isPresent()) {
            return existingSkill.get();
        } else {
            Skill newSkill = new Skill(skillName, "Technology");
            return skillRepository.save(newSkill);
        }
    }
}
