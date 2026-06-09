package com.javaweb.event_management_backend.BookingManagement.dtos.response;

import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.IssuedTicketResponseDto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookingResponseDto {

    // Used in booking history list
    // lightweight — no issued tickets
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long bookingId;
        private BookingStatus status;
        private BigDecimal totalAmount;
        private LocalDateTime bookingDate;
        private String eventTitle;
        private String eventVenue;
        private LocalDateTime eventStartDateTime;
        private Integer ticketCount;
        private String buyerName;
        private String buyerEmail;
    }

    // Used when viewing a specific booking
    // full details including all issued tickets
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Detail {
        private Long bookingId;
        private BookingStatus status;
        private BigDecimal totalAmount;
        private LocalDateTime bookingDate;
        private String eventTitle;
        private String eventVenue;
        private LocalDateTime eventStartDateTime;
        private String promotionCode;
        private BigDecimal discountApplied;
        private List<IssuedTicketResponseDto.Response> issuedTickets;
    }
}