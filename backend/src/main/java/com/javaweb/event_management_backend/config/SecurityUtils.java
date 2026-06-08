package com.javaweb.event_management_backend.config;


import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    // get currently logged in user from SecurityContext

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedAccessException("No authenticated user found");
        }

        return (User) authentication.getPrincipal();
    }



}