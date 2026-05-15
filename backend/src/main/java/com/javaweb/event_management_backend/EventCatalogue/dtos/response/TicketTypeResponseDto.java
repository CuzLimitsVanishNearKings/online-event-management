package com.javaweb.event_management_backend.EventCatalogue.dtos.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TicketTypeResponseDto {

    // Used in event detail page — shows available ticket types
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long ticketTypeId;
        private String name;
        private BigDecimal price;
        private Integer quantity;
        private Integer quantityRemaining;
        private LocalDateTime createdAt;
    }

    // Used in organizer dashboard — includes sales stats
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrganizerView {
        private Long ticketTypeId;
        private String name;
        private BigDecimal price;
        private Integer quantity;
        private Integer quantityRemaining;
        private Integer totalSold;
        private BigDecimal totalRevenue;
    }
}