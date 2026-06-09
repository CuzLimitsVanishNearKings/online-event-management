package com.javaweb.event_management_backend.EventCatalogue.controllers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.EventRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.EventResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.EventService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // ─── PUBLIC ─────────────────────────────────────────────────

    // GET /api/events
    // get all published events — browse page
    @GetMapping
    public ResponseEntity<List<EventResponseDto.Summary>> getAllPublishedEvents() {
        return ResponseEntity.ok(eventService.getAllPublishedEvents());
    }

    // GET /api/events/{eventId}
    // get event full details
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponseDto.Detail> getEventById(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getEventById(eventId));
    }

    // GET /api/events/search?keyword=tech
    // search events by keyword
    @GetMapping("/search")
    public ResponseEntity<List<EventResponseDto.Summary>> searchEvents(
            @RequestParam String keyword) {
        return ResponseEntity.ok(eventService.searchEvents(keyword));
    }

    // GET /api/events/category/{categoryName}
    // filter events by category
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<EventResponseDto.Summary>> getEventsByCategory(
            @PathVariable String categoryName) {
        return ResponseEntity.ok(
                eventService.getEventsByCategory(categoryName));
    }

    // GET /api/events/filter
    // advanced filter for events
    @GetMapping("/filter")
    public ResponseEntity<List<EventResponseDto.Summary>> filterEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String venue,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice) {
        return ResponseEntity.ok(eventService.filterEvents(keyword, category, venue, startDate, endDate, minPrice, maxPrice));
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    // GET /api/events/organizer/my-events
    // get all events for current organizer
    @GetMapping("/organizer/my-events")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<EventResponseDto.OrganizerView>> getOrganizerEvents() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                eventService.getOrganizerEvents(currentUser));
    }

    // POST /api/events
    // create a new event
    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponseDto.Detail> createEvent(
            @Valid @RequestBody EventRequestDto.CreateEvent dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(dto, currentUser));
    }

    // PUT /api/events/{eventId}
    // update an event
    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponseDto.Detail> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequestDto.UpdateEvent dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                eventService.updateEvent(eventId, dto, currentUser));
    }

    // DELETE /api/events/{eventId}
    // delete an event
    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId) {
        User currentUser = SecurityUtils.getCurrentUser();
        eventService.deleteEvent(eventId, currentUser);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/events/{eventId}/publish
    // publish a draft event
    @PatchMapping("/{eventId}/publish")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponseDto.Detail> publishEvent(
            @PathVariable Long eventId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                eventService.publishEvent(eventId, currentUser));
    }

    // PATCH /api/events/{eventId}/cancel
    // cancel an event
    @PatchMapping("/{eventId}/cancel")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponseDto.Detail> cancelEvent(
            @PathVariable Long eventId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                eventService.cancelEvent(eventId, currentUser));
    }

    // PATCH /api/events/{eventId}/reschedule
    // reschedule an event
    @PatchMapping("/{eventId}/reschedule")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponseDto.Detail> rescheduleEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequestDto.UpdateEvent dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                eventService.rescheduleEvent(eventId, dto, currentUser));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/events/admin/all
    // get all events regardless of status
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponseDto.Summary>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // DELETE /api/events/admin/{eventId}
    // delete/cancel an event as admin
    @DeleteMapping("/admin/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminDeleteEvent(
            @PathVariable Long eventId) {
        eventService.adminDeleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}