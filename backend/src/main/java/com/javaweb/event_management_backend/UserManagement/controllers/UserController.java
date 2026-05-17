package com.javaweb.event_management_backend.UserManagement.controllers;

import com.javaweb.event_management_backend.UserManagement.dtos.response.UserResponseDto;
import com.javaweb.event_management_backend.UserManagement.dtos.request.UserAuthRequestDto;
import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.services.interfaces.UserService;
import com.javaweb.event_management_backend.config.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // GET /api/users/me
    // get currently logged in user details
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto.UserDetail> getCurrentUser() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(userService.getCurrentUser(currentUser));
    }

    // PUT /api/users/profile
    // update current user profile (including base64 profilePic)
    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto.UserDetail> updateProfile(
            @RequestBody UserAuthRequestDto.UpdateProfile dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(userService.updateProfile(dto, currentUser));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/users
    // get all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto.UserSummary>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET /api/users/{userId}
    // get user by id
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto.UserDetail> getUserById(
            @PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // GET /api/users/role/{role}
    // get all users by role
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto.UserSummary>> getUsersByRole(
            @PathVariable UserRole role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    // GET /api/users/status/{status}
    // get all users by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto.UserSummary>> getUsersByStatus(
            @PathVariable UserStatus status) {
        return ResponseEntity.ok(userService.getUsersByStatus(status));
    }

    // PATCH /api/users/{userId}/suspend
    // suspend a user account
    @PatchMapping("/{userId}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto.UserDetail> suspendUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(userService.suspendUser(userId));
    }

    // PATCH /api/users/{userId}/activate
    // activate a suspended user account
    @PatchMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto.UserDetail> activateUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(userService.activateUser(userId));
    }

    // GET /api/users/organizers
    // get all organizers
    @GetMapping("/organizers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto.OrganizerSummary>> getAllOrganizers() {
        return ResponseEntity.ok(userService.getAllOrganizers());
    }

    // GET /api/users/{userId}/organizer
    // get organizer profile details
    @GetMapping("/{userId}/organizer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto.OrganizerDetails> getOrganizerDetails(
            @PathVariable Long userId) {
        return ResponseEntity.ok(userService.getOrganizerDetails(userId));
    }
}