package com.javaweb.event_management_backend.UserManagement.controllers;

import com.javaweb.event_management_backend.UserManagement.dtos.request.UserAuthRequestDto;
import com.javaweb.event_management_backend.UserManagement.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController
{
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserAuthRequestDto.UserSignup dto)
    {
        String token = authService.signup(dto);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "User registered successfully"
        ));
    }

    @PostMapping("/organizer/signup")
    public ResponseEntity<?> organizerSignup(@Valid @RequestBody UserAuthRequestDto.OrganizerSignup dto)
    {
        String token = authService.organizerSignup(dto);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Organizer registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserAuthRequestDto.Login dto)
    {
        String token = authService.login(dto);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Login successful"
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody UserAuthRequestDto.ForgotPassword dto) {
        authService.forgotPassword(dto);
        return ResponseEntity.ok(Map.of(
                "message", "If an account with that email exists, a password reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody UserAuthRequestDto.ResetPassword dto) {
        authService.resetPassword(dto);
        return ResponseEntity.ok(Map.of(
                "message", "Password has been successfully reset."
        ));
    }
}