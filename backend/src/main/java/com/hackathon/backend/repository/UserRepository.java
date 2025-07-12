package com.hackathon.backend.repository;

import com.hackathon.backend.entity.User;
import com.hackathon.backend.entity.Availability;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<User> findByEmailAndActiveTrue(String email);

    // Count active users for stats
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true AND u.emailVerified = true")
    Long countActiveUsers();

    // Find public profiles with pagination
    @Query("SELECT u FROM User u WHERE u.isProfilePublic = true AND u.active = true AND u.emailVerified = true ORDER BY u.averageRating DESC")
    Page<User> findPublicProfiles(Pageable pageable);

    // Search profiles by skills or name with filters
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN UserSkill us ON u.id = us.user.id 
        LEFT JOIN Skill s ON us.skill.id = s.id 
        WHERE u.isProfilePublic = true AND u.active = true AND u.emailVerified = true 
        AND (:search IS NULL OR :search = '' OR 
             LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR 
             LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR 
             LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:availability IS NULL OR u.availability = :availability)
        ORDER BY u.averageRating DESC
        """)
    Page<User> searchProfiles(@Param("search") String search,
                              @Param("availability") Availability availability,
                              Pageable pageable);
}
