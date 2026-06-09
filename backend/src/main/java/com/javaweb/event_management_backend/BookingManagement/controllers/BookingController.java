package com.javaweb.event_management_backend.BookingManagement.controllers;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.BookingRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.BookingResponseDto;
import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.BookingService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // POST /api/bookings
    // create a new booking
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<BookingResponseDto.Detail> createBooking(
            @Valid @RequestBody BookingRequestDto.CreateBooking dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(dto, currentUser));
    }

    // POST /api/bookings/cancel
    // cancel a booking
    @PostMapping("/cancel")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<BookingResponseDto.Detail> cancelBooking(
            @Valid @RequestBody BookingRequestDto.CancelBooking dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.cancelBooking(dto, currentUser));
    }

    // GET /api/bookings/my-bookings
    // get all bookings for current user
    @GetMapping("/my-bookings")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<List<BookingResponseDto.Summary>> getMyBookings() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.getMyBookings(currentUser));
    }

    // GET /api/bookings/my-bookings-detailed
    // get all bookings with detailed tickets for current user
    @GetMapping("/my-bookings-detailed")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BookingResponseDto.Detail>> getMyBookingsDetailed() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.getMyBookingsDetailed(currentUser));
    }

    // GET /api/bookings/{bookingId}
    // get booking details by id
    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<BookingResponseDto.Detail> getBookingById(
            @PathVariable Long bookingId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.getBookingById(bookingId, currentUser));
    }

    // GET /api/bookings/my-bookings/status/{status}
    // get bookings by status for current user
    @GetMapping("/my-bookings/status/{status}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<List<BookingResponseDto.Summary>> getMyBookingsByStatus(
            @PathVariable BookingStatus status) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.getMyBookingsByStatus(status, currentUser));
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    // GET /api/bookings/event/{eventId}
    // get all bookings for a specific event
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<BookingResponseDto.Summary>> getBookingsByEvent(
            @PathVariable Long eventId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.getBookingsByEvent(eventId, currentUser));
    }

    // GET /api/bookings/organizer
    // get all bookings across all events for the organizer
    @GetMapping("/organizer")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<BookingResponseDto.Summary>> getOrganizerBookings() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                bookingService.getOrganizerBookings(currentUser));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/bookings
    // get all bookings — admin dashboard
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookingResponseDto.Summary>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookingDate").descending());
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    // GET /api/bookings/status/{status}
    // get all bookings by status — admin dashboard
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDto.Summary>> getAllBookingsByStatus(
            @PathVariable BookingStatus status) {
        return ResponseEntity.ok(
                bookingService.getAllBookingsByStatus(status));
    }
}