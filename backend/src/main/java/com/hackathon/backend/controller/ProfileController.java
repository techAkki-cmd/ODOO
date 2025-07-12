package com.hackathon.backend.controller;

import com.hackathon.backend.dto.*;
import com.hackathon.backend.entity.Availability;
import com.hackathon.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/profiles")
    public ResponseEntity<ProfileSearchResponse> getProfiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String availability) {

        Availability availabilityEnum = null;
        if (availability != null && !availability.isEmpty()) {
            try {
                availabilityEnum = Availability.valueOf(availability.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid availability value, continue with null
            }
        }

        ProfileSearchResponse response = profileService.searchProfiles(search, availabilityEnum, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profiles/{id}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable Long id) {
        UserProfileDTO profile = profileService.getPublicProfile(id);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDTO> getPlatformStats() {
        PlatformStatsDTO stats = profileService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/profile/me")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            UserProfileDTO profile = profileService.getCurrentUserProfile(email);
            if (profile != null) {
                return ResponseEntity.ok(profile);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/profile/me")
    public ResponseEntity<ApiResponse> updateCurrentUserProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            ApiResponse response = profileService.updateUserProfile(email, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update profile: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/me/skills")
    public ResponseEntity<ApiResponse> updateUserSkills(
            @Valid @RequestBody UpdateSkillsRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            ApiResponse response = profileService.updateUserSkills(email, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update skills: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/me/photo")
    public ResponseEntity<ApiResponse> uploadProfilePhoto(
            @RequestParam("photo") MultipartFile photo,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Authentication required"));
        }

        try {
            String email = authentication.getName();
            ApiResponse response = profileService.updateProfilePhoto(email, photo);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to upload photo: " + e.getMessage()));
        }
    }
}
