package com.javaweb.event_management_backend.BookingManagement.services.interfaces;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.BookingRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.BookingResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.util.List;

public interface BookingService {

    // ─── CLIENT ──────────────────────────────────────────────────

    // Create a new booking
    // triggers payment and ticket generation
    BookingResponseDto.Detail createBooking(BookingRequestDto.CreateBooking dto,
                                            User currentUser);

    // Cancel an existing booking
    // triggers refund and ticket cancellation
    BookingResponseDto.Detail cancelBooking(BookingRequestDto.CancelBooking dto,
                                            User currentUser);

    // Get all bookings for current user
    // booking history page
    List<BookingResponseDto.Summary> getMyBookings(User currentUser);

    // Get booking details by id
    BookingResponseDto.Detail getBookingById(Long bookingId, User currentUser);

    // Get all bookings for current user by status
    // e.g "show me only my CONFIRMED bookings"
    List<BookingResponseDto.Summary> getMyBookingsByStatus(
            com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus status,
            User currentUser);

    // ─── ORGANIZER ───────────────────────────────────────────────

    // Get all bookings for a specific event
    // organizer sees who booked their event
    List<BookingResponseDto.Summary> getBookingsByEvent(Long eventId,
                                                        User currentUser);

    // Get all bookings for an organizer across all events
    List<BookingResponseDto.Summary> getOrganizerBookings(User currentUser);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get all bookings — admin dashboard
    List<BookingResponseDto.Summary> getAllBookings();

    // Get all bookings by status — admin dashboard
    List<BookingResponseDto.Summary> getAllBookingsByStatus(
            com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus status);
}