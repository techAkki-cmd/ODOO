package com.hackathon.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_skills")
public class UserSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillType type;

    @Column(nullable = false)
    private Integer proficiencyLevel = 1;

    // Constructors
    public UserSkill() {}

    public UserSkill(User user, Skill skill, SkillType type, Integer proficiencyLevel) {
        this.user = user;
        this.skill = skill;
        this.type = type;
        this.proficiencyLevel = proficiencyLevel;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public SkillType getType() { return type; }
    public void setType(SkillType type) { this.type = type; }

    public Integer getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(Integer proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public enum SkillType {
        OFFERED, WANTED
    }
}
