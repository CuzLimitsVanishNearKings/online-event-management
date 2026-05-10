package com.javaweb.event_management_backend.UserManagement.mappers;

import com.javaweb.event_management_backend.UserManagement.dtos.request.UserAuthRequestDto;
import com.javaweb.event_management_backend.UserManagement.dtos.response.UserResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserMappers
{
    // Entity → DTO

    public UserResponseDto.UserDetail toDetail(User user)
    {
        return UserResponseDto.UserDetail.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .profilePic(user.getProfilePic())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserResponseDto.UserSummary toSummary(User user)
    {
        return UserResponseDto.UserSummary.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    // DTO → Entity

    public User toEntity(UserAuthRequestDto.UserSignup dto)
    {
        return User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .userName(dto.getUserName())
                .email(dto.getEmail())
                .passwordHash(dto.getPassword())
                .profilePic(dto.getProfilePic())
                .build();
    }
}