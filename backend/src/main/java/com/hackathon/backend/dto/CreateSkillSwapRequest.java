// CreateSkillSwapRequest.java
package com.hackathon.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateSkillSwapRequest {
    @NotNull(message = "Partner ID is required")
    private Long partnerId;

    @NotBlank(message = "Offered skill is required")
    private String offeredSkill;

    @NotBlank(message = "Requested skill is required")
    private String requestedSkill;

    private String message;

    private String status = "PENDING";

    // Constructors
    public CreateSkillSwapRequest() {}

    public CreateSkillSwapRequest(Long partnerId, String offeredSkill, String requestedSkill, String message) {
        this.partnerId = partnerId;
        this.offeredSkill = offeredSkill;
        this.requestedSkill = requestedSkill;
        this.message = message;
    }

    // Getters and Setters
    public Long getPartnerId() { return partnerId; }
    public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }

    public String getOfferedSkill() { return offeredSkill; }
    public void setOfferedSkill(String offeredSkill) { this.offeredSkill = offeredSkill; }

    public String getRequestedSkill() { return requestedSkill; }
    public void setRequestedSkill(String requestedSkill) { this.requestedSkill = requestedSkill; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
