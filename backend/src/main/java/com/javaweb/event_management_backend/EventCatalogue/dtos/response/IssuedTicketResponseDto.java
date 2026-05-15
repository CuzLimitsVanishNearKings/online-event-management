package com.javaweb.event_management_backend.EventCatalogue.dtos.response;

import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class IssuedTicketResponseDto {

    // Used when showing a user their ticket
    // after a successful booking
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long issuedTicketId;
        private String qrCode;
        private String ticketCode;
        private IssuedTicketStatus status;
        private LocalDateTime issuedAt;
        private String ticketTypeName;
        private BigDecimal ticketTypePrice;
    }

    // Used when an organizer verifies a ticket at the door
    // shows just enough info to confirm entry
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationResult {
        private Long issuedTicketId;
        private String ticketCode;
        private IssuedTicketStatus status;
        private Boolean isValid;
        private String attendeeName;
        private String eventTitle;
        private String ticketTypeName;
        private LocalDateTime issuedAt;
        private String message;
    }
}