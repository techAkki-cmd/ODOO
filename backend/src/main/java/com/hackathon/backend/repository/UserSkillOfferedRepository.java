package com.hackathon.backend.repository;

import com.hackathon.backend.entity.UserSkillOffered;
import com.hackathon.backend.entity.User;
import com.hackathon.backend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillOfferedRepository extends JpaRepository<UserSkillOffered, Long> {
    List<UserSkillOffered> findByUser(User user);
    List<UserSkillOffered> findBySkill(Skill skill);

    @Query("SELECT uso FROM UserSkillOffered uso WHERE uso.user.isProfilePublic = true AND uso.skill.id = :skillId")
    List<UserSkillOffered> findPublicUsersBySkill(Long skillId);

    @Query("SELECT uso FROM UserSkillOffered uso WHERE uso.user.isProfilePublic = true AND uso.user.active = true")
    List<UserSkillOffered> findAllPublicSkills();
}
