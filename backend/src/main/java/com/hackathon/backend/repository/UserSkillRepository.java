package com.hackathon.backend.repository;

import com.hackathon.backend.entity.UserSkill;
import com.hackathon.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    @Query("SELECT us FROM UserSkill us JOIN FETCH us.skill WHERE us.user = :user AND us.type = :type")
    List<UserSkill> findByUserAndType(@Param("user") User user, @Param("type") UserSkill.SkillType type);

    void deleteByUserAndType(User user, UserSkill.SkillType type);
}
