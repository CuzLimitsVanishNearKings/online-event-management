package com.javaweb.event_management_backend.PaymentManagement.services.interfaces;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.WalletRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.WalletResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.math.BigDecimal;

public interface WalletService {

    // ─── CLIENT ──────────────────────────────────────────────────

    // Get current user wallet details
    WalletResponseDto.WalletDetail getMyWallet(User currentUser);

    // Get current user wallet with transaction history
    WalletResponseDto.WalletWithTransactions getMyWalletWithTransactions(
            User currentUser);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get wallet by user id — admin use
    WalletResponseDto.WalletDetail getWalletByUserId(Long userId);

    // Manually adjust wallet balance — admin use
    // e.g fixing an error
    WalletResponseDto.WalletDetail adjustBalance(Long userId,
                                                 WalletRequestDto.AdjustBalance dto);

    // ─── INTERNAL ────────────────────────────────────────────────

    // Deduct amount from wallet — called by PaymentService
    void deductBalance(User user, BigDecimal amount, String description);

    // Credit amount to wallet — called by PaymentService on refund
    // or TopUpRequestService on approval
    void creditBalance(User user, BigDecimal amount, String description);

    // Check if wallet has sufficient balance
    // called by PaymentService before deducting
    boolean hasSufficientBalance(User user, BigDecimal amount);

    // Create wallet for new user — called by AuthService on signup
    void createWallet(User user);
}