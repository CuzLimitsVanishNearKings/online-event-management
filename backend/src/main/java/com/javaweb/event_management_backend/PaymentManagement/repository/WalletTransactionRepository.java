package com.javaweb.event_management_backend.PaymentManagement.repository;

import com.javaweb.event_management_backend.PaymentManagement.enums.TransactionType;
import com.javaweb.event_management_backend.PaymentManagement.models.Wallet;
import com.javaweb.event_management_backend.PaymentManagement.models.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    // Find all transactions for a wallet
    List<WalletTransaction> findByWallet(Wallet wallet);

    // Find all transactions for a wallet ordered by most recent first
    Page<WalletTransaction> findByWalletOrderByCreatedAtDesc(Wallet wallet, Pageable pageable);

    // Find all transactions by type for a wallet
    // e.g "show me all DEBIT transactions for this wallet"
    List<WalletTransaction> findByWalletAndType(Wallet wallet, TransactionType type);

    // Find all transactions between two dates
    List<WalletTransaction> findByWalletAndCreatedAtBetween(
            Wallet wallet,
            LocalDateTime start,
            LocalDateTime end
    );

    // Calculate total amount debited from a wallet
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM WalletTransaction t " +
            "WHERE t.wallet = :wallet AND t.type = 'DEBIT'")
    BigDecimal calculateTotalDebited(Wallet wallet);

    // Calculate total amount credited to a wallet
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM WalletTransaction t " +
            "WHERE t.wallet = :wallet AND t.type = 'CREDIT'")
    BigDecimal calculateTotalCredited(Wallet wallet);

    // Count total transactions for a wallet
    long countByWallet(Wallet wallet);
}