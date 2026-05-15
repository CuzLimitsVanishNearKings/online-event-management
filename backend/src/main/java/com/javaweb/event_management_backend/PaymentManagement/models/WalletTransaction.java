package com.javaweb.event_management_backend.PaymentManagement.models;

import com.javaweb.event_management_backend.PaymentManagement.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transaction")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}