package com.javaweb.event_management_backend.EventCatalogue.controllers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.TicketTypeRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.TicketTypeResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.TicketTypeService;
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
@RequestMapping("/api/events/{eventId}/ticket-types")
@RequiredArgsConstructor
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    // ─── PUBLIC ─────────────────────────────────────────────────

    // GET /api/events/{eventId}/ticket-types
    // get all ticket types for an event
    @GetMapping
    public ResponseEntity<List<TicketTypeResponseDto.Response>> getTicketTypesByEvent(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(
                ticketTypeService.getTicketTypesByEvent(eventId));
    }

    // GET /api/events/{eventId}/ticket-types/{ticketTypeId}
    // get a specific ticket type
    @GetMapping("/{ticketTypeId}")
    public ResponseEntity<TicketTypeResponseDto.Response> getTicketTypeById(
            @PathVariable Long eventId,
            @PathVariable Long ticketTypeId) {
        return ResponseEntity.ok(
                ticketTypeService.getTicketTypeById(ticketTypeId));
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    // POST /api/events/{eventId}/ticket-types
    // add a new ticket type to an event
    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<TicketTypeResponseDto.Response> createTicketType(
            @PathVariable Long eventId,
            @Valid @RequestBody TicketTypeRequestDto.CreateTicketType dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketTypeService.createTicketType(
                        eventId, dto, currentUser));
    }

    // PUT /api/events/{eventId}/ticket-types/{ticketTypeId}
    // update a ticket type
    @PutMapping("/{ticketTypeId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<TicketTypeResponseDto.Response> updateTicketType(
            @PathVariable Long eventId,
            @PathVariable Long ticketTypeId,
            @Valid @RequestBody TicketTypeRequestDto.UpdateTicketType dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                ticketTypeService.updateTicketType(
                        ticketTypeId, dto, currentUser));
    }

    // DELETE /api/events/{eventId}/ticket-types/{ticketTypeId}
    // delete a ticket type
    @DeleteMapping("/{ticketTypeId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> deleteTicketType(
            @PathVariable Long eventId,
            @PathVariable Long ticketTypeId) {
        User currentUser = SecurityUtils.getCurrentUser();
        ticketTypeService.deleteTicketType(ticketTypeId, currentUser);
        return ResponseEntity.noContent().build();
    }

    // GET /api/events/{eventId}/ticket-types/organizer
    // get ticket types with sales stats — organizer dashboard
    @GetMapping("/organizer")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<TicketTypeResponseDto.OrganizerView>>
    getTicketTypesByEventForOrganizer(
            @PathVariable Long eventId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                ticketTypeService.getTicketTypesByEventForOrganizer(
                        eventId, currentUser));
    }
}