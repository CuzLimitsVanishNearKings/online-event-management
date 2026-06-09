package com.javaweb.event_management_backend.PlanningManagement.mappers;

import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.PlanningManagement.dtos.response.PlanningResponseDto;
import com.javaweb.event_management_backend.PlanningManagement.models.Planning;
import org.springframework.stereotype.Component;

@Component
public class PlanningMapper
{
    // Entity → DTO
    public PlanningResponseDto.SavedEvent toSavedEvent(Planning planning)
    {
        Event event = planning.getEvent();

        return PlanningResponseDto.SavedEvent.builder()
                .planningId(planning.getPlanningId())
                .eventId(event.getEventId())
                .eventTitle(event.getTitle())
                .eventVenue(event.getVenue())
                .eventStartDateTime(event.getStartDateTime())
                .coverImage(event.getCoverImage())
                .savedAt(planning.getSavedAt())
                .isSaved(true)
                .build();
    }

    // Used when checking if an event is saved — returns false
    public PlanningResponseDto.SavedEvent toNotSaved(Event event)
    {
        return PlanningResponseDto.SavedEvent.builder()
                .eventId(event.getEventId())
                .eventTitle(event.getTitle())
                .isSaved(false)
                .build();
    }
}