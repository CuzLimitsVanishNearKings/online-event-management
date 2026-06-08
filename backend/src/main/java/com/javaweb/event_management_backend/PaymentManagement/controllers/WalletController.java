package com.javaweb.event_management_backend.PaymentManagement.controllers;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.WalletRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.WalletResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.WalletService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController
{
    private final WalletService walletService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // GET /api/wallet
    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<WalletResponseDto.WalletDetail> getMyWallet()
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(walletService.getMyWallet(currentUser));
    }

    // GET /api/wallet/transactions?page=0&size=10&sort=createdAt,desc
    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<WalletResponseDto.WalletWithTransactions>
    getMyWalletWithTransactions(Pageable pageable)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                walletService.getMyWalletWithTransactions(currentUser, pageable));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/wallet/admin/{userId}
    @GetMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WalletResponseDto.WalletDetail> getWalletByUserId(
            @PathVariable Long userId)
    {
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }

    // PATCH /api/wallet/admin/{userId}/adjust
    @PatchMapping("/admin/{userId}/adjust")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WalletResponseDto.WalletDetail> adjustBalance(
            @PathVariable Long userId,
            @Valid @RequestBody WalletRequestDto.AdjustBalance dto)
    {
        return ResponseEntity.ok(walletService.adjustBalance(userId, dto));
    }
}