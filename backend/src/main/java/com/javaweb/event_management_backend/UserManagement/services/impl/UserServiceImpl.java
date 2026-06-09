package com.javaweb.event_management_backend.UserManagement.services.impl;

import com.javaweb.event_management_backend.UserManagement.dtos.response.UserResponseDto;
import com.javaweb.event_management_backend.UserManagement.dtos.request.UserAuthRequestDto;
import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import com.javaweb.event_management_backend.UserManagement.mappers.UserMappers;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.UserManagement.repository.UserRepository;
import com.javaweb.event_management_backend.UserManagement.services.interfaces.UserService;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;
    private final UserMappers userMappers;
    private final PasswordEncoder passwordEncoder;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    public UserResponseDto.UserDetail getCurrentUser(User currentUser) {
        return userMappers.toDetail(currentUser);
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public UserResponseDto.UserDetail getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));
        return userMappers.toDetail(user);
    }

    @Override
    public List<UserResponseDto.UserSummary> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMappers::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponseDto.UserSummary> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role)
                .stream()
                .map(userMappers::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponseDto.UserSummary> getUsersByStatus(UserStatus status) {
        return userRepository.findByStatus(status)
                .stream()
                .map(userMappers::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDto.UserDetail suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        if (user.getRole() == UserRole.ADMIN) {
            throw new UnauthorizedAccessException(
                    "Cannot suspend an admin account");
        }

        user.setStatus(UserStatus.SUSPENDED);
        userRepository.save(user);
        return userMappers.toDetail(user);
    }

    @Override
    @Transactional
    public UserResponseDto.UserDetail activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        return userMappers.toDetail(user);
    }

    @Override
    public UserResponseDto.OrganizerDetails getOrganizerDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        OrganizerProfile profile = organizerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizer profile not found for user: " + userId));

        return UserResponseDto.OrganizerDetails.builder()
                .organizationName(profile.getOrganizationName())
                .description(profile.getDescription())
                .website(profile.getWebsite())
                .location(profile.getLocation())
                .logoUrl(profile.getLogoUrl())
                .build();
    }

    @Override
    public List<UserResponseDto.OrganizerSummary> getAllOrganizers() {
        return userRepository.findByRole(UserRole.ORGANIZER)
                .stream()
                .map(user -> {
                    OrganizerProfile profile = organizerRepository
                            .findByUser(user)
                            .orElse(null);
                    return UserResponseDto.OrganizerSummary.builder()
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .organizationName(profile != null
                                    ? profile.getOrganizationName()
                                    : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDto.UserDetail updateProfile(UserAuthRequestDto.UpdateProfile dto, User currentUser) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getFirstName() != null && !dto.getFirstName().isBlank()) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null && !dto.getLastName().isBlank()) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getUserName() != null && !dto.getUserName().isBlank()) {
            user.setUserName(dto.getUserName());
        }
        if (dto.getProfilePic() != null) {
            user.setProfilePic(dto.getProfilePic());
        }

        userRepository.save(user);
        return userMappers.toDetail(user);
    }

    @Override
    @Transactional
    public void changePassword(UserAuthRequestDto.ChangePassword dto, User currentUser) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}