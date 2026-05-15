package com.javaweb.event_management_backend.PaymentManagement.dtos.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

public class TopUpRequestDto {

    // Used when a user submits a top up request
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTopUpRequest {

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1000.0", inclusive = true, message = "Minimum top up amount is 1,000 XAF")
        @DecimalMax(value = "1000000.0", inclusive = true, message = "Maximum top up amount is 1,000,000 XAF")
        private BigDecimal amount;
    }

    // Used when an admin approves or rejects a top up request
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewTopUpRequest {

        @NotNull(message = "Request id is required")
        private Long requestId;

        @NotNull(message = "Approval decision is required")
        private Boolean approved;

        // optional — admin can leave a note especially on rejection
        private String adminNote;
    }
}