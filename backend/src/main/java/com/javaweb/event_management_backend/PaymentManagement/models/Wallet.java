package com.javaweb.event_management_backend.PaymentManagement.models;

import com.javaweb.event_management_backend.UserManagement.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "wallet")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Wallet
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_id")
    private Long walletId;

    @Column(name = "balance", nullable = false)
    @Builder.Default
    private BigDecimal balance = new BigDecimal("0.00");

    @Column(name = "currency", nullable = false)
    @Builder.Default
    private String currency = "XAF";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // --- Relationships ---

    // One Wallet belongs to One User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // One Wallet has Many Transactions
    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WalletTransaction> transactions = new ArrayList<>();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
