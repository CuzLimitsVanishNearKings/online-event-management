package com.javaweb.event_management_backend.EventCatalogue.dtos.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class EventRequestDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateEvent {

        @NotBlank(message = "Event title is required")
        private String title;

        private String description;

        @NotBlank(message = "Venue is required")
        private String venue;

        @NotNull(message = "Start date and time is required")
        @Future(message = "Start date must be in the future")
        private LocalDateTime startDateTime;

        @NotNull(message = "End date and time is required")
        @Future(message = "End date must be in the future")
        private LocalDateTime endDateTime;

        @NotNull(message = "Capacity is required")
        @Positive(message = "Capacity must be a positive number")
        private Integer capacity;

        private String coverImage;

        @NotNull(message = "Category is required")
        private Long categoryId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateEvent {

        private String title;
        private String description;
        private String venue;

        @Future(message = "Start date must be in the future")
        private LocalDateTime startDateTime;

        @Future(message = "End date must be in the future")
        private LocalDateTime endDateTime;

        @Positive(message = "Capacity must be a positive number")
        private Integer capacity;

        private String coverImage;
        private Long categoryId;
    }
}