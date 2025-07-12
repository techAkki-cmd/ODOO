package com.hackathon.backend.service;

import com.hackathon.backend.dto.ApiResponse;
import com.hackathon.backend.dto.ConnectionRequestDTO;
import com.hackathon.backend.dto.ConnectionRequestResponseDTO;
import com.hackathon.backend.dto.UserProfileDTO;
import com.hackathon.backend.entity.ConnectionRequest;
import com.hackathon.backend.entity.User;
import com.hackathon.backend.repository.ConnectionRequestRepository;
import com.hackathon.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConnectionService {

    @Autowired
    private ConnectionRequestRepository connectionRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse sendConnectionRequest(String senderEmail, ConnectionRequestDTO requestDTO) {
        try {
            // Find sender
            Optional<User> senderOpt = userRepository.findByEmailAndActiveTrue(senderEmail);
            if (senderOpt.isEmpty()) {
                return new ApiResponse(false, "Sender not found");
            }
            User sender = senderOpt.get();

            // Find receiver
            Optional<User> receiverOpt = userRepository.findById(requestDTO.getReceiverId());
            if (receiverOpt.isEmpty()) {
                return new ApiResponse(false, "Receiver not found");
            }
            User receiver = receiverOpt.get();

            // Check if receiver profile is public and active
            if (!receiver.getIsProfilePublic() || !receiver.getActive()) {
                return new ApiResponse(false, "Cannot send request to this user");
            }

            // Check if sender is trying to connect with themselves
            if (sender.getId().equals(receiver.getId())) {
                return new ApiResponse(false, "Cannot send connection request to yourself");
            }

            // Check if connection request already exists
            boolean requestExists = checkExistingRequest(sender, receiver);
            if (requestExists) {
                return new ApiResponse(false, "Connection request already exists or you are already connected");
            }

            // Create new connection request
            ConnectionRequest connectionRequest = new ConnectionRequest(sender, receiver, requestDTO.getMessage());
            connectionRequestRepository.save(connectionRequest);

            return new ApiResponse(true, "Connection request sent successfully to " + receiver.getFullName());

        } catch (Exception e) {
            System.err.println("Error in sendConnectionRequest: " + e.getMessage());
            e.printStackTrace();
            return new ApiResponse(false, "Failed to send connection request: " + e.getMessage());
        }
    }

    private boolean checkExistingRequest(User sender, User receiver) {
        try {
            return connectionRequestRepository.existsBySenderAndReceiverAndStatusIn(
                    sender, receiver, Arrays.asList(
                            ConnectionRequest.RequestStatus.PENDING,
                            ConnectionRequest.RequestStatus.ACCEPTED
                    )
            );
        } catch (Exception e) {
            // Fallback method if the repository method doesn't exist
            Optional<ConnectionRequest> existingRequest = connectionRequestRepository.findBySenderAndReceiver(sender, receiver);
            if (existingRequest.isPresent()) {
                ConnectionRequest.RequestStatus status = existingRequest.get().getStatus();
                return status == ConnectionRequest.RequestStatus.PENDING ||
                        status == ConnectionRequest.RequestStatus.ACCEPTED;
            }
            return false;
        }
    }

    public List<ConnectionRequestResponseDTO> getReceivedRequests(String email) {
        User user = userRepository.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ConnectionRequest> requests = connectionRequestRepository
                .findByReceiverAndStatus(user, ConnectionRequest.RequestStatus.PENDING);

        return requests.stream()
                .map(this::convertToConnectionRequestDTO)
                .collect(Collectors.toList());
    }

    public List<ConnectionRequestResponseDTO> getSentRequests(String email) {
        User user = userRepository.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ConnectionRequest> requests = connectionRequestRepository
                .findBySenderAndStatus(user, ConnectionRequest.RequestStatus.PENDING);

        return requests.stream()
                .map(this::convertToConnectionRequestDTO)
                .collect(Collectors.toList());
    }

    public ApiResponse acceptConnectionRequest(String email, Long requestId) {
        try {
            User user = userRepository.findByEmailAndActiveTrue(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<ConnectionRequest> requestOpt = connectionRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return new ApiResponse(false, "Connection request not found");
            }

            ConnectionRequest request = requestOpt.get();

            // Verify user is the receiver
            if (!request.getReceiver().getId().equals(user.getId())) {
                return new ApiResponse(false, "You are not authorized to accept this request");
            }

            // Check if request is still pending
            if (request.getStatus() != ConnectionRequest.RequestStatus.PENDING) {
                return new ApiResponse(false, "This request has already been processed");
            }

            // Accept the request
            request.setStatus(ConnectionRequest.RequestStatus.ACCEPTED);
            request.setRespondedAt(LocalDateTime.now());
            connectionRequestRepository.save(request);

            return new ApiResponse(true, "Connection request accepted successfully");

        } catch (Exception e) {
            return new ApiResponse(false, "Failed to accept connection request: " + e.getMessage());
        }
    }

    public ApiResponse declineConnectionRequest(String email, Long requestId) {
        try {
            User user = userRepository.findByEmailAndActiveTrue(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<ConnectionRequest> requestOpt = connectionRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return new ApiResponse(false, "Connection request not found");
            }

            ConnectionRequest request = requestOpt.get();

            // Verify user is the receiver
            if (!request.getReceiver().getId().equals(user.getId())) {
                return new ApiResponse(false, "You are not authorized to decline this request");
            }

            // Check if request is still pending
            if (request.getStatus() != ConnectionRequest.RequestStatus.PENDING) {
                return new ApiResponse(false, "This request has already been processed");
            }

            // Decline the request
            request.setStatus(ConnectionRequest.RequestStatus.DECLINED);
            request.setRespondedAt(LocalDateTime.now());
            connectionRequestRepository.save(request);

            return new ApiResponse(true, "Connection request declined successfully");

        } catch (Exception e) {
            return new ApiResponse(false, "Failed to decline connection request: " + e.getMessage());
        }
    }

    private ConnectionRequestResponseDTO convertToConnectionRequestDTO(ConnectionRequest request) {
        ConnectionRequestResponseDTO dto = new ConnectionRequestResponseDTO();
        dto.setId(request.getId());
        dto.setMessage(request.getMessage());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setRespondedAt(request.getRespondedAt());

        // Convert sender and receiver to profile DTOs
        dto.setSender(convertToBasicProfileDTO(request.getSender()));
        dto.setReceiver(convertToBasicProfileDTO(request.getReceiver()));

        return dto;
    }

    private UserProfileDTO convertToBasicProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfilePhoto(user.getProfilePhoto());
        dto.setLocation(user.getLocation());
        dto.setAverageRating(user.getAverageRating());
        dto.setCompletedSwaps(user.getCompletedSwaps());
        dto.setAvailability(user.getAvailability());
        return dto;
    }
}
