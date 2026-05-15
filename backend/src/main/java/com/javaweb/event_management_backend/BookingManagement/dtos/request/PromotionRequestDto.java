package com.javaweb.event_management_backend.BookingManagement.dtos.request;

import com.javaweb.event_management_backend.BookingManagement.enums.DiscountType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PromotionRequestDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePromotion {

        @NotBlank(message = "Promotion code is required")
        private String code;

        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
        private BigDecimal discountValue;

        @NotNull(message = "Discount type is required")
        private DiscountType discountType;

        @NotNull(message = "Start date is required")
        @FutureOrPresent(message = "Start date must be today or in the future")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        @Future(message = "End date must be in the future")
        private LocalDate endDate;

        @NotNull(message = "Usage limit is required")
        @Positive(message = "Usage limit must be a positive number")
        private Integer usageLimit;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePromotion {

        @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
        private BigDecimal discountValue;

        private DiscountType discountType;

        @FutureOrPresent(message = "Start date must be today or in the future")
        private LocalDate startDate;

        @Future(message = "End date must be in the future")
        private LocalDate endDate;

        @Positive(message = "Usage limit must be a positive number")
        private Integer usageLimit;
    }

    // Used when a user validates a promo code at checkout
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidateCode {

        @NotBlank(message = "Promotion code is required")
        private String code;
    }
}