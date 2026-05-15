package com.javaweb.event_management_backend.EventCatalogue.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class IssuedTicketRequestDto {

    // Used when scanning a ticket at the door via QR code
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyByQrCode {

        @NotBlank(message = "QR code is required")
        private String qrCode;
    }

    // Used when manually entering a ticket code at the door
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyByTicketCode {

        @NotBlank(message = "Ticket code is required")
        private String ticketCode;
    }
}