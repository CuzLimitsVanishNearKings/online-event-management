package com.javaweb.event_management_backend.UserManagement.services.interfaces;

import com.javaweb.event_management_backend.UserManagement.dtos.response.UserResponseDto;
import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.util.List;

public interface UserService {

    // Get currently logged in user details
    UserResponseDto.UserDetail getCurrentUser(User currentUser);

    // Get user by id — admin use
    UserResponseDto.UserDetail getUserById(Long userId);

    // Get all users — admin use
    List<UserResponseDto.UserSummary> getAllUsers();

    // Get all users by role — admin use
    List<UserResponseDto.UserSummary> getUsersByRole(UserRole role);

    // Get all users by status — admin use
    List<UserResponseDto.UserSummary> getUsersByStatus(UserStatus status);

    // Suspend a user account — admin use
    UserResponseDto.UserDetail suspendUser(Long userId);

    // Activate a suspended user account — admin use
    UserResponseDto.UserDetail activateUser(Long userId);

    // Get organizer profile details
    UserResponseDto.OrganizerDetails getOrganizerDetails(Long userId);

    // Get all organizers — admin use
    List<UserResponseDto.OrganizerSummary> getAllOrganizers();
}