package com.hackathon.backend.dto;

public class PlatformStatsDTO {
    private Long activeMembers;
    private Long successfulMatches;
    private Long totalSkillsOffered;
    private Long totalConnectionRequests;

    // Constructors
    public PlatformStatsDTO() {}

    public PlatformStatsDTO(Long activeMembers, Long successfulMatches, Long totalSkillsOffered, Long totalConnectionRequests) {
        this.activeMembers = activeMembers;
        this.successfulMatches = successfulMatches;
        this.totalSkillsOffered = totalSkillsOffered;
        this.totalConnectionRequests = totalConnectionRequests;
    }

    // Getters and Setters
    public Long getActiveMembers() { return activeMembers; }
    public void setActiveMembers(Long activeMembers) { this.activeMembers = activeMembers; }

    public Long getSuccessfulMatches() { return successfulMatches; }
    public void setSuccessfulMatches(Long successfulMatches) { this.successfulMatches = successfulMatches; }

    public Long getTotalSkillsOffered() { return totalSkillsOffered; }
    public void setTotalSkillsOffered(Long totalSkillsOffered) { this.totalSkillsOffered = totalSkillsOffered; }

    public Long getTotalConnectionRequests() { return totalConnectionRequests; }
    public void setTotalConnectionRequests(Long totalConnectionRequests) { this.totalConnectionRequests = totalConnectionRequests; }
}
