package com.javaweb.event_management_backend.PlanningManagement.dtos.response;

import lombok.*;

import java.time.LocalDateTime;

public class PlanningResponseDto
{
    // Used when returning a single saved event
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SavedEvent
    {
        private Long planningId;
        private Long eventId;
        private String eventTitle;
        private String eventVenue;
        private LocalDateTime eventStartDateTime;
        private String coverImage;
        private LocalDateTime savedAt;
        private Boolean isSaved;
    }
}