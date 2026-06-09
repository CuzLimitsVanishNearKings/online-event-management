package com.javaweb.event_management_backend.UserManagement.repository;

import com.javaweb.event_management_backend.UserManagement.models.PasswordResetToken;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);
    void deleteByUser(User user);
}
