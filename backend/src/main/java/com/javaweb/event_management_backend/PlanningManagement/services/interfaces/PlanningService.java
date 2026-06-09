package com.javaweb.event_management_backend.PlanningManagement.services.interfaces;

import com.javaweb.event_management_backend.PlanningManagement.dtos.response.PlanningResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.util.List;

public interface PlanningService
{
    // Save an event to planning
    PlanningResponseDto.SavedEvent saveEvent(Long eventId, User currentUser);

    // Remove an event from planning
    void removeEvent(Long eventId, User currentUser);

    // Get all saved events for current user
    List<PlanningResponseDto.SavedEvent> getMyPlanning(User currentUser);

    // Check if a specific event is saved by current user
    PlanningResponseDto.SavedEvent checkIfSaved(Long eventId, User currentUser);
}