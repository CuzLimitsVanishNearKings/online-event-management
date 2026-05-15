package com.javaweb.event_management_backend.PaymentManagement.models;

import com.javaweb.event_management_backend.PaymentManagement.enums.TopUpRequestStatus;
import com.javaweb.event_management_backend.UserManagement.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "top_up_request")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopUpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TopUpRequestStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "admin_note")
    private String adminNote;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by", nullable = true)
    private User reviewedBy;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TopUpRequestStatus.PENDING;
        }
    }
}