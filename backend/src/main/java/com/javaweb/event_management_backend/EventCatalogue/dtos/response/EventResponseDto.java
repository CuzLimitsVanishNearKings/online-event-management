package com.javaweb.event_management_backend.EventCatalogue.dtos.response;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class EventResponseDto {

    // Used in event listings / browse page
    // lightweight — no ticket types, no full organizer details
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long eventId;
        private String title;
        private String venue;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private EventStatus status;
        private String coverImage;
        private CategoryResponseDto.Summary category;
        private String organizerName;
        private String organizerLogoUrl;
        private java.math.BigDecimal startingPrice;
        private Integer ticketsSold;
    }

    // Used when viewing a single event page
    // full details including ticket types
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Detail {
        private Long eventId;
        private String title;
        private String description;
        private String venue;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private Integer capacity;
        private EventStatus status;
        private String coverImage;
        private LocalDateTime createdAt;
        private CategoryResponseDto.Detail category;
        private String organizerName;
        private String organizerLogoUrl;
        private String organizerDescription;
        private List<TicketTypeResponseDto.Response> ticketTypes;
    }

    // Used in organizer dashboard
    // includes sales stats per event
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrganizerView {
        private Long eventId;
        private String title;
        private String venue;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private Integer capacity;
        private EventStatus status;
        private String coverImage;
        private Integer totalTicketsSold;
        private Integer totalTicketsRemaining;
        private java.math.BigDecimal totalRevenue;
    }
}