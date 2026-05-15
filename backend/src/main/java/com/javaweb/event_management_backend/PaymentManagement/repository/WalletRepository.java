package com.javaweb.event_management_backend.PaymentManagement.repository;

import com.javaweb.event_management_backend.PaymentManagement.models.Wallet;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    // Find wallet by its owner
    Optional<Wallet> findByUser(User user);

    // Find wallet by user id directly
    Optional<Wallet> findByUserUserId(Long userId);

    // Check if a user already has a wallet
    // used during registration to avoid duplicates
    boolean existsByUser(User user);
}