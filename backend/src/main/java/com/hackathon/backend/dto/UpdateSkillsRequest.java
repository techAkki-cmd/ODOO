package com.hackathon.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class UpdateSkillsRequest {
    @NotNull
    private List<String> skillsOffered;

    @NotNull
    private List<String> skillsWanted;

    // Constructors
    public UpdateSkillsRequest() {}

    public UpdateSkillsRequest(List<String> skillsOffered, List<String> skillsWanted) {
        this.skillsOffered = skillsOffered;
        this.skillsWanted = skillsWanted;
    }

    // Getters and Setters
    public List<String> getSkillsOffered() { return skillsOffered; }
    public void setSkillsOffered(List<String> skillsOffered) { this.skillsOffered = skillsOffered; }

    public List<String> getSkillsWanted() { return skillsWanted; }
    public void setSkillsWanted(List<String> skillsWanted) { this.skillsWanted = skillsWanted; }
}
