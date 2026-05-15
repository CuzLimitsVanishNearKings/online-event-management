package com.javaweb.event_management_backend.EventCatalogue.dtos.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

public class TicketTypeRequestDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTicketType {

        @NotBlank(message = "Ticket type name is required")
        private String name;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
        private BigDecimal price;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be a positive number")
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateTicketType {

        private String name;

        @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
        private BigDecimal price;

        @Positive(message = "Quantity must be a positive number")
        private Integer quantity;
    }
}