package com.javaweb.event_management_backend.PaymentManagement.dtos.response;

import com.javaweb.event_management_backend.PaymentManagement.enums.TopUpRequestStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TopUpRequestResponseDto {

    // Used when a user views their top up requests
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long requestId;
        private BigDecimal amount;
        private TopUpRequestStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime reviewedAt;
        private String adminNote;
    }

    // Used in admin dashboard
    // includes user info and admin note
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminView {
        private Long requestId;
        private BigDecimal amount;
        private TopUpRequestStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime reviewedAt;
        private String requesterName;
        private String requesterEmail;
        private String reviewedByName;
        private String adminNote;
    }

    // Used after admin approves or rejects
    // tells the admin what happened
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewResult {
        private Long requestId;
        private TopUpRequestStatus status;
        private BigDecimal amount;
        private String requesterName;
        private String adminNote;
        private String message;
    }
}