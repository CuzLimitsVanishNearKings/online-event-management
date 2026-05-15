package com.javaweb.event_management_backend.BookingManagement.dtos.response;

import com.javaweb.event_management_backend.BookingManagement.enums.DiscountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PromotionResponseDto {

    // Used when admin views promotions list
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long promotionId;
        private String code;
        private BigDecimal discountValue;
        private DiscountType discountType;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer usageLimit;
        private Integer timesUsed;
        private Boolean isActive;
    }

    // Used when a user validates a promo code at checkout
    // shows the discount that will be applied
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ValidationResult {
        private String code;
        private BigDecimal discountValue;
        private DiscountType discountType;
        private Boolean isValid;
        private String message;
    }
}