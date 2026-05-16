package com.javaweb.event_management_backend.config;

import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    // get currently logged in user from SecurityContext
    public static User getCurrentUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}