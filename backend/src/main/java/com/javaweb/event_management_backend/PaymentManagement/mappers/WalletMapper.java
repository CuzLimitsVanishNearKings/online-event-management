package com.javaweb.event_management_backend.PaymentManagement.mappers;

import com.javaweb.event_management_backend.PaymentManagement.dtos.response.WalletResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.models.Wallet;
import com.javaweb.event_management_backend.PaymentManagement.models.WalletTransaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WalletMapper {

    // Entity → DTO
    public WalletResponseDto.WalletDetail toWalletDetail(Wallet wallet) {
        return WalletResponseDto.WalletDetail.builder()
                .walletId(wallet.getWalletId())
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .createdAt(wallet.getCreatedAt())
                .ownerName(wallet.getUser().getFirstName()
                        + " " + wallet.getUser().getLastName())
                .ownerEmail(wallet.getUser().getEmail())
                .build();
    }

    public WalletResponseDto.WalletWithTransactions toWalletWithTransactions(
            Wallet wallet,
            BigDecimal totalCredited,
            BigDecimal totalDebited) {

        return WalletResponseDto.WalletWithTransactions.builder()
                .walletId(wallet.getWalletId())
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .totalCredited(totalCredited)
                .totalDebited(totalDebited)
                .transactions(
                        wallet.getTransactions().stream()
                                .map(this::toTransactionResponse)
                                .collect(Collectors.toList())
                )
                .build();
    }

    public WalletResponseDto.TransactionResponse toTransactionResponse(
            WalletTransaction transaction) {
        return WalletResponseDto.TransactionResponse.builder()
                .transactionId(transaction.getTransactionId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }

    // No toEntity here — wallets are created
    // automatically when a user registers
}