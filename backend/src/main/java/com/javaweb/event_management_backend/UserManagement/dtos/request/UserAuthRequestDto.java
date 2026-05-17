package com.javaweb.event_management_backend.UserManagement.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UserAuthRequestDto
{

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Login
    {
        @NotBlank @Email
        private String email ;
        @NotBlank
        private String password ;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserSignup {

        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        private String userName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        private String profilePic;
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrganizerSignup extends UserSignup
    {
        @NotBlank
        private String organizationName;

        private String description;
        private String location;
        private String website;
        private String logoUrl;



    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateProfile {
        private String firstName;
        private String lastName;
        private String userName;
        private String profilePic;
    }
}
