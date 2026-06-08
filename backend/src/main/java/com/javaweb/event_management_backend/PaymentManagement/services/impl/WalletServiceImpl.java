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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService
{
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final WalletMapper walletMapper;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public WalletResponseDto.WalletDetail getMyWallet(User currentUser)
    {
        Wallet wallet = findWalletByUser(currentUser);
        return walletMapper.toWalletDetail(wallet);
    }

    @Override
    @Transactional(readOnly = true)
    public WalletResponseDto.WalletWithTransactions getMyWalletWithTransactions(
            User currentUser, Pageable pageable)
    {
        Wallet wallet = findWalletByUser(currentUser);

        BigDecimal totalCredited = walletTransactionRepository
                .calculateTotalCredited(wallet);
        BigDecimal totalDebited = walletTransactionRepository
                .calculateTotalDebited(wallet);

        // ← this is where transactionPage comes from
        Page<WalletTransaction> transactionPage = walletTransactionRepository
                .findByWalletOrderByCreatedAtDesc(wallet, pageable);

        return walletMapper.toWalletWithTransactions(
                wallet,
                transactionPage.getContent(), // List extracted here
                totalCredited,
                totalDebited);
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public WalletResponseDto.WalletDetail getWalletByUserId(Long userId)
    {
        Wallet wallet = walletRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Wallet not found for user: " + userId));
        return walletMapper.toWalletDetail(wallet);
    }

    @Override
    @Transactional
    public WalletResponseDto.WalletDetail adjustBalance(Long userId,
                                                        WalletRequestDto.AdjustBalance dto)
    {
        Wallet wallet = walletRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Wallet not found for user: " + userId));

        // amount can be positive (credit) or negative (debit)
        wallet.setBalance(wallet.getBalance().add(dto.getAmount()));
        walletRepository.save(wallet);

        // determine transaction type based on amount sign
        TransactionType type = dto.getAmount().compareTo(BigDecimal.ZERO) >= 0
                ? TransactionType.CREDIT
                : TransactionType.DEBIT;

        recordTransaction(wallet,
                dto.getAmount().abs(),
                type,
                "Admin adjustment: " + dto.getReason());

        return walletMapper.toWalletDetail(wallet);
    }

    // ─── INTERNAL ────────────────────────────────────────────────

    @Override
    @Transactional
    public void deductBalance(User user, BigDecimal amount, String description)
    {
        Wallet wallet = findWalletByUser(user);

        if (wallet.getBalance().compareTo(amount) < 0)
        {
            throw new InsufficientBalanceException(
                    "Insufficient wallet balance. Required: "
                            + amount + " XAF. Available: "
                            + wallet.getBalance() + " XAF");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        recordTransaction(wallet, amount, TransactionType.DEBIT, description);
    }

    @Override
    @Transactional
    public void creditBalance(User user, BigDecimal amount, String description)
    {
        Wallet wallet = findWalletByUser(user);

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        recordTransaction(wallet, amount, TransactionType.CREDIT, description);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasSufficientBalance(User user, BigDecimal amount)
    {
        Wallet wallet = findWalletByUser(user);
        return wallet.getBalance().compareTo(amount) >= 0;
    }

    @Override
    @Transactional
    public void createWallet(User user)
    {
        if (walletRepository.existsByUser(user))
        {
            return;
        }

        Wallet wallet = Wallet.builder()
                .user(user)
                .build();

        walletRepository.save(wallet);
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Wallet findWalletByUser(User user)
    {
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Wallet not found for user: " + user.getEmail()));
    }

    private void recordTransaction(Wallet wallet, BigDecimal amount,
                                   TransactionType type, String description)
    {
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .description(description)
                .build();
        walletTransactionRepository.save(transaction);
    }
}