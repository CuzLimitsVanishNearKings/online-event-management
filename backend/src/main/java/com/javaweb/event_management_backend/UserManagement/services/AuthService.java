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
}