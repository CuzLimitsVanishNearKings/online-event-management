package com.javaweb.event_management_backend.BookingManagement.dtos.response;

import com.javaweb.event_management_backend.BookingManagement.enums.PaymentMethod;
import com.javaweb.event_management_backend.BookingManagement.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponseDto {

    // Used after a payment is initiated
    // tells the user if payment succeeded or failed
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentResult {
        private Long paymentId;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
        private PaymentStatus status;
        private LocalDateTime paymentDate;
        private Long bookingId;
        private String message;
    }

    // Used in admin dashboard
    // includes booking and user info
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminView {
        private Long paymentId;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
        private PaymentStatus status;
        private LocalDateTime paymentDate;
        private Long bookingId;
        private String attendeeName;
        private String attendeeEmail;
        private String eventTitle;
    }
}