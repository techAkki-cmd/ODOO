package com.hackathon.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_skills_offered")
public class UserSkillOffered {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;

    private Integer yearsExperience;

    @Column(length = 500)
    private String description;

    // Constructors, getters, setters
    public UserSkillOffered() {}

    public UserSkillOffered(User user, Skill skill) {
        this.user = user;
        this.skill = skill;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public Integer getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(Integer yearsExperience) { this.yearsExperience = yearsExperience; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
