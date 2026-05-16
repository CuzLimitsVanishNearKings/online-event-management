package com.javaweb.event_management_backend.PaymentManagement.services.impl;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.WalletRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.WalletResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.enums.TransactionType;
import com.javaweb.event_management_backend.PaymentManagement.mappers.WalletMapper;
import com.javaweb.event_management_backend.PaymentManagement.models.Wallet;
import com.javaweb.event_management_backend.PaymentManagement.models.WalletTransaction;
import com.javaweb.event_management_backend.PaymentManagement.repository.WalletRepository;
import com.javaweb.event_management_backend.PaymentManagement.repository.WalletTransactionRepository;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.WalletService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.exceptions.InsufficientBalanceException;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final WalletMapper walletMapper;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    public WalletResponseDto.WalletDetail getMyWallet(User currentUser) {
        Wallet wallet = findWalletByUser(currentUser);
        return walletMapper.toWalletDetail(wallet);
    }

    @Override
    public WalletResponseDto.WalletWithTransactions getMyWalletWithTransactions(
            User currentUser) {

        Wallet wallet = findWalletByUser(currentUser);

        // calculate total credited and debited
        BigDecimal totalCredited = walletTransactionRepository
                .calculateTotalCredited(wallet);
        BigDecimal totalDebited = walletTransactionRepository
                .calculateTotalDebited(wallet);

        // get transactions ordered by most recent first
        wallet.setTransactions(
                walletTransactionRepository
                        .findByWalletOrderByCreatedAtDesc(wallet));

        return walletMapper.toWalletWithTransactions(
                wallet, totalCredited, totalDebited);
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public WalletResponseDto.WalletDetail getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Wallet not found for user: " + userId));
        return walletMapper.toWalletDetail(wallet);
    }

    @Override
    @Transactional
    public WalletResponseDto.WalletDetail adjustBalance(Long userId,
                                                        WalletRequestDto.AdjustBalance dto) {

        Wallet wallet = walletRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Wallet not found for user: " + userId));

        // credit the wallet
        wallet.setBalance(wallet.getBalance().add(dto.getAmount()));
        walletRepository.save(wallet);

        // record the transaction
        recordTransaction(wallet, dto.getAmount(),
                TransactionType.CREDIT,
                "Admin adjustment: " + dto.getReason());

        return walletMapper.toWalletDetail(wallet);
    }

    // ─── INTERNAL ────────────────────────────────────────────────

    @Override
    @Transactional
    public void deductBalance(User user, BigDecimal amount,
                              String description) {

        Wallet wallet = findWalletByUser(user);

        // double check balance before deducting
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient wallet balance. Required: "
                            + amount + " XAF. Available: "
                            + wallet.getBalance() + " XAF");
        }

        // deduct balance
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        // record transaction
        recordTransaction(wallet, amount,
                TransactionType.DEBIT, description);
    }

    @Override
    @Transactional
    public void creditBalance(User user, BigDecimal amount,
                              String description) {

        Wallet wallet = findWalletByUser(user);

        // add to balance
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        // record transaction
        recordTransaction(wallet, amount,
                TransactionType.CREDIT, description);
    }

    @Override
    public boolean hasSufficientBalance(User user, BigDecimal amount) {
        Wallet wallet = findWalletByUser(user);
        return wallet.getBalance().compareTo(amount) >= 0;
    }

    @Override
    @Transactional
    public void createWallet(User user) {
        // check wallet doesn't already exist
        if (walletRepository.existsByUser(user)) {
            return;
        }

        Wallet wallet = Wallet.builder()
                .user(user)
                .build();

        walletRepository.save(wallet);

        // record initial funding transaction
        recordTransaction(wallet,
                new BigDecimal("500000.00"),
                TransactionType.CREDIT,
                "Initial wallet funding");
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Wallet findWalletByUser(User user) {
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Wallet not found for user: "
                                + user.getEmail()));
    }

    // helper to record every wallet transaction
    private void recordTransaction(Wallet wallet, BigDecimal amount,
                                   TransactionType type, String description) {
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .description(description)
                .build();
        walletTransactionRepository.save(transaction);
    }
}