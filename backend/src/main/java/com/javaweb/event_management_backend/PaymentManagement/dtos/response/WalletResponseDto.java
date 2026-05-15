package com.javaweb.event_management_backend.PaymentManagement.dtos.response;

import com.javaweb.event_management_backend.PaymentManagement.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class WalletResponseDto {

    // Used when a user views their wallet
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WalletDetail {
        private Long walletId;
        private BigDecimal balance;
        private String currency;
        private LocalDateTime createdAt;
        private String ownerName;
        private String ownerEmail;
    }

    // Used when a user views their wallet
    // with recent transaction history
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WalletWithTransactions {
        private Long walletId;
        private BigDecimal balance;
        private String currency;
        private BigDecimal totalCredited;
        private BigDecimal totalDebited;
        private List<TransactionResponse> transactions;
    }

    // Used in transaction history list
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransactionResponse {
        private Long transactionId;
        private BigDecimal amount;
        private TransactionType type;
        private String description;
        private LocalDateTime createdAt;
    }
}