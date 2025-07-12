package com.hackathon.backend.controller;

import com.hackathon.backend.dto.ApiResponse;
import com.hackathon.backend.dto.ConnectionRequestDTO;
import com.hackathon.backend.dto.ConnectionRequestResponseDTO;
import com.hackathon.backend.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:3000")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse> sendConnectionRequest(
            @Valid @RequestBody ConnectionRequestDTO request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Authentication required"));
        }

        try {
            String senderEmail = authentication.getName();
            ApiResponse response = connectionService.sendConnectionRequest(senderEmail, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to send connection request: " + e.getMessage()));
        }
    }

    @GetMapping("/received")
    public ResponseEntity<List<ConnectionRequestResponseDTO>> getReceivedRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            List<ConnectionRequestResponseDTO> requests = connectionService.getReceivedRequests(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ConnectionRequestResponseDTO>> getSentRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            List<ConnectionRequestResponseDTO> requests = connectionService.getSentRequests(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<ApiResponse> acceptConnectionRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            ApiResponse response = connectionService.acceptConnectionRequest(email, requestId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to accept request: " + e.getMessage()));
        }
    }

    @PutMapping("/{requestId}/decline")
    public ResponseEntity<ApiResponse> declineConnectionRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            ApiResponse response = connectionService.declineConnectionRequest(email, requestId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to decline request: " + e.getMessage()));
        }
    }
}
