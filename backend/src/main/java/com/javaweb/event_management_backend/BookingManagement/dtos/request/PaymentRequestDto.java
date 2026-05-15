package com.javaweb.event_management_backend.BookingManagement.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

public class PaymentRequestDto {

    // Used when a user initiates a payment for a booking
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InitiatePayment {

        @NotNull(message = "Booking id is required")
        private Long bookingId;
    }
}