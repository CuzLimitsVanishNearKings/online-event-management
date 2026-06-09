package com.javaweb.event_management_backend.EventCatalogue.controllers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.IssuedTicketRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.IssuedTicketResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.IssuedTicketService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class IssuedTicketController
{
    private final IssuedTicketService issuedTicketService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // GET /api/tickets/my-tickets
    // get all tickets for current user across all bookings
    @GetMapping("/my-tickets")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<List<IssuedTicketResponseDto.Response>> getMyTickets()
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(issuedTicketService.getMyTickets(currentUser));
    }

    // GET /api/tickets/booking/{bookingId}
    // get all tickets for a specific booking
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<List<IssuedTicketResponseDto.Response>>
    getTicketsByBooking(@PathVariable Long bookingId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                issuedTicketService.getTicketsByBooking(bookingId, currentUser));
    }

    // GET /api/tickets/{issuedTicketId}
    // get a single ticket by id
    @GetMapping("/{issuedTicketId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<IssuedTicketResponseDto.Response> getTicketById(
            @PathVariable Long issuedTicketId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                issuedTicketService.getTicketById(issuedTicketId, currentUser));
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    // POST /api/tickets/verify/qr
    // verify a ticket by QR code at the door
    @PostMapping("/verify/qr")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<IssuedTicketResponseDto.VerificationResult>
    verifyByQrCode(
            @Valid @RequestBody IssuedTicketRequestDto.VerifyByQrCode dto)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                issuedTicketService.verifyByQrCode(dto, currentUser));
    }

    // POST /api/tickets/verify/code
    // verify a ticket by manual code at the door
    @PostMapping("/verify/code")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<IssuedTicketResponseDto.VerificationResult>
    verifyByTicketCode(
            @Valid @RequestBody IssuedTicketRequestDto.VerifyByTicketCode dto)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                issuedTicketService.verifyByTicketCode(dto, currentUser));
    }

    // GET /api/tickets/event/{eventId}
    // get all tickets for an event — organizer attendee list
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<IssuedTicketResponseDto.Response>>
    getTicketsByEvent(@PathVariable Long eventId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                issuedTicketService.getTicketsByEvent(eventId, currentUser));
    }

    // GET /api/tickets/organizer
    // get all tickets across all events for the organizer
    @GetMapping("/organizer")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<IssuedTicketResponseDto.Response>> getOrganizerTickets() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                issuedTicketService.getOrganizerTickets(currentUser));
    }
}