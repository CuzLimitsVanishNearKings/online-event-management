package com.javaweb.event_management_backend.UserManagement.dtos.response;

import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

public class UserResponseDto
{
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary
    {
        private String firstName;
        private String lastName;
        private String email;
        private String userName;
        private UserStatus status;
        private UserRole role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDetail
    {
        private String firstName;
        private String lastName;
        private String userName;
        private String email;
        private UserRole role;
        private UserStatus status;
        private String profilePic;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizerSummary extends UserSummary
    {
        private String organizationName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizerDetails extends UserDetail
    {
        private String organizationName;
        private String description;
        private String website;
        private String location;
        private String logoUrl;
    }
}