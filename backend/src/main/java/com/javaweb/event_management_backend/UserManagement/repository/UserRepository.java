package com.javaweb.event_management_backend.UserManagement.repository;

import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long >
{

    List<User> findByFirstName(String firstName);

    List<User> findByLastName(String lastName);

    Optional<User> findByEmail(String email) ;

    List<User> findByStatus(UserStatus status);

    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<User> findByCreatedAtAfter(LocalDateTime date);

    List<User> findByCreatedAtBefore(LocalDateTime date);

    List<User> findByRole(UserRole role);



}
