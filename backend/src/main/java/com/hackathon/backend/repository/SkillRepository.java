package com.hackathon.backend.repository;

import com.hackathon.backend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);

    @Query("SELECT COUNT(DISTINCT us.skill) FROM UserSkill us WHERE us.type = 'OFFERED'")
    Long countOfferedSkills();
}
