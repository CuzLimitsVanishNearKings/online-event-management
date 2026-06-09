package com.javaweb.event_management_backend.EventCatalogue.services.interfaces;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.IssuedTicketRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.IssuedTicketResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.util.List;

public interface IssuedTicketService {

    // ─── CLIENT ──────────────────────────────────────────────────

    // Get all tickets for a booking
    // user views their tickets after booking
    List<IssuedTicketResponseDto.Response> getTicketsByBooking(Long bookingId,
                                                               User currentUser);

    // Get a single ticket by id
    IssuedTicketResponseDto.Response getTicketById(Long issuedTicketId,
                                                   User currentUser);

    // ─── ORGANIZER ───────────────────────────────────────────────

    // Verify a ticket by QR code at the door
    IssuedTicketResponseDto.VerificationResult verifyByQrCode(
            IssuedTicketRequestDto.VerifyByQrCode dto,
            User currentUser);

    // Verify a ticket by manual code at the door
    IssuedTicketResponseDto.VerificationResult verifyByTicketCode(
            IssuedTicketRequestDto.VerifyByTicketCode dto,
            User currentUser);

    // Get all issued tickets for an event
    // organizer sees who is attending
    List<IssuedTicketResponseDto.Response> getTicketsByEvent(Long eventId,
                                                             User currentUser);

    // Get all issued tickets across all events for an organizer
    List<IssuedTicketResponseDto.Response> getOrganizerTickets(User currentUser);

    List<IssuedTicketResponseDto.Response> getMyTickets(User currentUser);

    // ─── INTERNAL ────────────────────────────────────────────────

    // Generate tickets after a successful payment
    // called internally by BookingService
    // not exposed as a controller endpoint
    List<IssuedTicketResponseDto.Response> generateTickets(Long bookingId,
                                                           Long ticketTypeId,
                                                           Integer quantity);
}