package com.javaweb.event_management_backend.BookingManagement.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.List;

public class BookingRequestDto {

    // Used when a user creates a booking
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateBooking {

        @NotNull(message = "Ticket type is required")
        private Long ticketTypeId;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be a positive number")
        private Integer quantity;

        // optional — user may or may not apply a promo code
        private String promotionCode;
    }

    // Used when a user cancels a booking
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancelBooking {

        @NotNull(message = "Booking id is required")
        private Long bookingId;
    }
}