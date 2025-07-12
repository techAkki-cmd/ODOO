package com.hackathon.backend.dto;

import com.hackathon.backend.entity.ConnectionRequest;
import java.time.LocalDateTime;

public class ConnectionRequestResponseDTO {
    private Long id;
    private UserProfileDTO sender;
    private UserProfileDTO receiver;
    private String message;
    private ConnectionRequest.RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;

    // Constructors
    public ConnectionRequestResponseDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserProfileDTO getSender() { return sender; }
    public void setSender(UserProfileDTO sender) { this.sender = sender; }

    public UserProfileDTO getReceiver() { return receiver; }
    public void setReceiver(UserProfileDTO receiver) { this.receiver = receiver; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ConnectionRequest.RequestStatus getStatus() { return status; }
    public void setStatus(ConnectionRequest.RequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
}
