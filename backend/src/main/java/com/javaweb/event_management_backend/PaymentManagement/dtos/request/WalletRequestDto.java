package com.javaweb.event_management_backend.PaymentManagement.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

public class WalletRequestDto {

    // No create request needed — wallet is created
    // automatically when a user registers

    // Used when an admin manually adjusts a wallet balance
    // e.g fixing an error or issuing a manual credit
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdjustBalance {

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be a positive number")
        private java.math.BigDecimal amount;

        @NotBlank(message = "Reason is required")
        private String reason;
    }
}