
package com.hackathon.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ConnectionRequestDTO {
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private String message;

    // Constructors
    public ConnectionRequestDTO() {}

    public ConnectionRequestDTO(Long receiverId, String message) {
        this.receiverId = receiverId;
        this.message = message;
    }

    // Getters and Setters
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
