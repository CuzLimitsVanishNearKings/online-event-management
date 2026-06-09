package com.javaweb.event_management_backend.PlanningManagement.controllers;

import com.javaweb.event_management_backend.PlanningManagement.dtos.response.PlanningResponseDto;
import com.javaweb.event_management_backend.PlanningManagement.services.interfaces.PlanningService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planning")
@RequiredArgsConstructor
public class PlanningController
{
    private final PlanningService planningService;

    // POST /api/planning/{eventId}
    // save an event to planning
    @PostMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<PlanningResponseDto.SavedEvent> saveEvent(
            @PathVariable Long eventId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(planningService.saveEvent(eventId, currentUser));
    }

    // DELETE /api/planning/{eventId}
    // remove an event from planning
    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<Void> removeEvent(@PathVariable Long eventId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        planningService.removeEvent(eventId, currentUser);
        return ResponseEntity.noContent().build();
    }

    // GET /api/planning
    // get all saved events for current user
    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<List<PlanningResponseDto.SavedEvent>> getMyPlanning()
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(planningService.getMyPlanning(currentUser));
    }

    // GET /api/planning/{eventId}/check
    // check if a specific event is saved
    @GetMapping("/{eventId}/check")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<PlanningResponseDto.SavedEvent> checkIfSaved(
            @PathVariable Long eventId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                planningService.checkIfSaved(eventId, currentUser));
    }
}