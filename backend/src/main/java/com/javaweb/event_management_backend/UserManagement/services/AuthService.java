package com.javaweb.event_management_backend.UserManagement.services;

import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.WalletService;
import com.javaweb.event_management_backend.UserManagement.dtos.request.UserAuthRequestDto;
import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import com.javaweb.event_management_backend.UserManagement.mappers.UserMappers;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.UserManagement.repository.UserRepository;
import com.javaweb.event_management_backend.UserManagement.security.JwtService;
import com.javaweb.event_management_backend.exceptions.EmailAlreadyExistsException;
import com.javaweb.event_management_backend.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMappers userMappers;
    private final WalletService walletService;
    private final com.javaweb.event_management_backend.UserManagement.repository.PasswordResetTokenRepository passwordResetTokenRepository;
    private final com.javaweb.event_management_backend.UserManagement.services.interfaces.EmailService emailService;

    // Regular user signup
    @Transactional
    public String signup(UserAuthRequestDto.UserSignup dto)
    {
        if (userRepository.findByEmail(dto.getEmail()).isPresent())
        {
            throw new EmailAlreadyExistsException(
                    "Email already in use: " + dto.getEmail());
        }

        User user = userMappers.toEntity(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.CLIENT);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        // creates wallet and records initial 500,000 XAF transaction
        walletService.createWallet(user);

        return jwtService.generateToken(user);
    }

    // Organizer signup
    @Transactional
    public String organizerSignup(UserAuthRequestDto.OrganizerSignup dto)
    {
        if (userRepository.findByEmail(dto.getEmail()).isPresent())
        {
            throw new EmailAlreadyExistsException(
                    "Email already in use: " + dto.getEmail());
        }

        User user = userMappers.toEntity(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ORGANIZER);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        OrganizerProfile profile = OrganizerProfile.builder()
                .user(user)
                .organizationName(dto.getOrganizationName())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .website(dto.getWebsite())
                .logoUrl(dto.getLogoUrl())
                .verified(false)
                .build();

        organizerRepository.save(profile);

        // creates wallet and records initial 500,000 XAF transaction
        walletService.createWallet(user);

        return jwtService.generateToken(user);
    }

    // Login
    public String login(UserAuthRequestDto.Login dto)
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found with email: " + dto.getEmail()));

        return jwtService.generateToken(user);
    }

    @Transactional
    public void forgotPassword(UserAuthRequestDto.ForgotPassword dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found with email: " + dto.getEmail()));

        // Remove old token if exists
        passwordResetTokenRepository.deleteByUser(user);

        // Generate new token
        String token = java.util.UUID.randomUUID().toString();
        com.javaweb.event_management_backend.UserManagement.models.PasswordResetToken resetToken = 
            com.javaweb.event_management_backend.UserManagement.models.PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryDate(java.time.LocalDateTime.now().plusMinutes(15))
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(UserAuthRequestDto.ResetPassword dto) {
        com.javaweb.event_management_backend.UserManagement.models.PasswordResetToken resetToken = 
            passwordResetTokenRepository.findByToken(dto.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Password reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        // Invalidate token after successful reset
        passwordResetTokenRepository.delete(resetToken);
    }
}