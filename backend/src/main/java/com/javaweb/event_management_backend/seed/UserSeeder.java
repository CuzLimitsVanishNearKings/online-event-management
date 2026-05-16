package com.javaweb.event_management_backend.seed;

import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.WalletService;
import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.UserManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserSeeder {

    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletService walletService;

    public void seed() {

        // ─── ADMINS ──────────────────────────────────────────────

        User admin = User.builder()
                .firstName("Super")
                .lastName("Admin")
                .userName("superadmin")
                .email("admin@eventify.cm")
                .passwordHash(passwordEncoder.encode("Admin@1234"))
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(admin);
        walletService.createWallet(admin);

        // ─── ORGANIZERS ──────────────────────────────────────────

        User organizer1 = User.builder()
                .firstName("Alice")
                .lastName("Mbeki")
                .userName("alice_mbeki")
                .email("alice@techevents.cm")
                .passwordHash(passwordEncoder.encode("Organizer@1234"))
                .role(UserRole.ORGANIZER)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(organizer1);
        walletService.createWallet(organizer1);

        OrganizerProfile profile1 = OrganizerProfile.builder()
                .user(organizer1)
                .organizationName("Tech Events Cameroon")
                .description("Premier technology events organizer in Cameroon")
                .location("Yaoundé, Cameroon")
                .website("www.techevents.cm")
                .logoUrl("https://via.placeholder.com/150")
                .verified(true)
                .build();
        organizerRepository.save(profile1);

        User organizer2 = User.builder()
                .firstName("Bruno")
                .lastName("Nkomo")
                .userName("bruno_nkomo")
                .email("bruno@culturecm.cm")
                .passwordHash(passwordEncoder.encode("Organizer@1234"))
                .role(UserRole.ORGANIZER)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(organizer2);
        walletService.createWallet(organizer2);

        OrganizerProfile profile2 = OrganizerProfile.builder()
                .user(organizer2)
                .organizationName("Culture Cameroon")
                .description("Celebrating Cameroonian culture through events")
                .location("Douala, Cameroon")
                .website("www.culturecm.cm")
                .logoUrl("https://via.placeholder.com/150")
                .verified(true)
                .build();
        organizerRepository.save(profile2);

        // ─── CLIENTS ─────────────────────────────────────────────

        User client1 = User.builder()
                .firstName("Jean")
                .lastName("Fotso")
                .userName("jean_fotso")
                .email("jean@gmail.com")
                .passwordHash(passwordEncoder.encode("Client@1234"))
                .role(UserRole.CLIENT)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(client1);
        walletService.createWallet(client1);

        User client2 = User.builder()
                .firstName("Marie")
                .lastName("Biya")
                .userName("marie_biya")
                .email("marie@gmail.com")
                .passwordHash(passwordEncoder.encode("Client@1234"))
                .role(UserRole.CLIENT)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(client2);
        walletService.createWallet(client2);

        User client3 = User.builder()
                .firstName("Paul")
                .lastName("Nguema")
                .userName("paul_nguema")
                .email("paul@gmail.com")
                .passwordHash(passwordEncoder.encode("Client@1234"))
                .role(UserRole.CLIENT)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(client3);
        walletService.createWallet(client3);

        User client4 = User.builder()
                .firstName("Grace")
                .lastName("Atangana")
                .userName("grace_atangana")
                .email("grace@gmail.com")
                .passwordHash(passwordEncoder.encode("Client@1234"))
                .role(UserRole.CLIENT)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(client4);
        walletService.createWallet(client4);

        System.out.println("✅ UserSeeder — seeded successfully");
    }
}