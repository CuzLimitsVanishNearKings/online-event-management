package com.javaweb.event_management_backend.EventCatalogue.services.impl;

import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.BookingManagement.repository.BookingRepository;
import com.javaweb.event_management_backend.EventCatalogue.dtos.request.IssuedTicketRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.IssuedTicketResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import com.javaweb.event_management_backend.EventCatalogue.mappers.IssuedTicketMapper;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.models.IssuedTicket;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.IssuedTicketRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.TicketTypeRepository;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.IssuedTicketService;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssuedTicketServiceImpl implements IssuedTicketService {

    private final IssuedTicketRepository issuedTicketRepository;
    private final BookingRepository bookingRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;
    private final IssuedTicketMapper issuedTicketMapper;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<IssuedTicketResponseDto.Response> getTicketsByBooking(
            Long bookingId, User currentUser) {

        Booking booking = findBookingById(bookingId);

        // user can only view their own tickets
        if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view these tickets");
        }

        return issuedTicketRepository.findByBooking(booking)
                .stream()
                .map(issuedTicketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public IssuedTicketResponseDto.Response getTicketById(
            Long issuedTicketId, User currentUser) {

        IssuedTicket ticket = findTicketById(issuedTicketId);

        // user can only view their own tickets
        if (!ticket.getBooking().getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view this ticket");
        }

        return issuedTicketMapper.toResponse(ticket);
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    @Override
    @Transactional
    public IssuedTicketResponseDto.VerificationResult verifyByQrCode(
            IssuedTicketRequestDto.VerifyByQrCode dto,
            User currentUser) {

        IssuedTicket ticket = issuedTicketRepository
                .findByQrCode(dto.getQrCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket not found with QR code: " + dto.getQrCode()));

        return processVerification(ticket, currentUser);
    }

    @Override
    @Transactional
    public IssuedTicketResponseDto.VerificationResult verifyByTicketCode(
            IssuedTicketRequestDto.VerifyByTicketCode dto,
            User currentUser) {

        IssuedTicket ticket = issuedTicketRepository
                .findByTicketCode(dto.getTicketCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket not found with code: " + dto.getTicketCode()));

        return processVerification(ticket, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssuedTicketResponseDto.Response> getTicketsByEvent(
            Long eventId, User currentUser) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));

        // verify organizer owns the event
        if (!event.getOrganizer().getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view tickets for this event");
        }

        // get all tickets through ticket types
        return event.getTicketTypes()
                .stream()
                .flatMap(tt -> issuedTicketRepository
                        .findByTicketType(tt).stream())
                .map(issuedTicketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssuedTicketResponseDto.Response> getOrganizerTickets(User currentUser) {
        OrganizerProfile organizer = organizerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer profile not found"));

        return issuedTicketRepository.findByOrganizer(organizer)
                .stream()
                .map(issuedTicketMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ─── INTERNAL ────────────────────────────────────────────────

    @Override
    @Transactional
    public List<IssuedTicketResponseDto.Response> generateTickets(
            Long bookingId, Long ticketTypeId, Integer quantity) {

        Booking booking = findBookingById(bookingId);

        TicketType ticketType = ticketTypeRepository.findByIdWithPessimisticLock(ticketTypeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket type not found with id: " + ticketTypeId));

        List<IssuedTicket> tickets = new ArrayList<>();

// After
        for (int i = 0; i < quantity; i++) {
            IssuedTicket ticket = IssuedTicket.builder()
                    .qrCode(generateUniqueQrCode())
                    .ticketCode(generateUniqueTicketCode(
                            ticketType.getEvent().getEventId()))
                    .status(IssuedTicketStatus.VALID)
                    .ticketType(ticketType)
                    .booking(booking)
                    .build();

            tickets.add(ticket);
        }

        issuedTicketRepository.saveAll(tickets);
        // decrement quantityRemaining on ticket type
        ticketType.setQuantityRemaining(
                ticketType.getQuantityRemaining() - quantity);
        ticketTypeRepository.save(ticketType);

        return tickets.stream()
                .map(issuedTicketMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    // shared verification logic for both QR and ticket code
    private IssuedTicketResponseDto.VerificationResult processVerification(
            IssuedTicket ticket, User currentUser) {

        // verify organizer owns the event
        Event event = ticket.getTicketType().getEvent();
        if (!event.getOrganizer().getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to verify tickets for this event");
        }

        // only mark as USED if ticket is VALID
        if (ticket.getStatus() == IssuedTicketStatus.VALID) {
            ticket.setStatus(IssuedTicketStatus.USED);
            issuedTicketRepository.save(ticket);
        }

        return issuedTicketMapper.toVerificationResult(ticket);
    }

    // generate unique QR code
    private String generateUniqueQrCode() {
        String qrCode;
        do {
            qrCode = UUID.randomUUID().toString();
        } while (issuedTicketRepository.existsByQrCode(qrCode));
        return qrCode;
    }

    // generate unique short ticket code
    // format: EVT-{eventId}-{randomAlphanumeric(6)}
    private String generateUniqueTicketCode(Long eventId) {
        String ticketCode;
        do {
            ticketCode = "EVT-" + eventId + "-"
                    + generateRandomAlphanumeric(6);
        } while (issuedTicketRepository.existsByTicketCode(ticketCode));
        return ticketCode;
    }

    private String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(
                    (int) (Math.random() * chars.length())));
        }
        return sb.toString();
    }

    private Booking findBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));
    }

    private IssuedTicket findTicketById(Long issuedTicketId) {
        return issuedTicketRepository.findById(issuedTicketId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket not found with id: " + issuedTicketId));
    }

    // IssuedTicketServiceImpl.java — inside the CLIENT section
    @Override
    @Transactional(readOnly = true)
    public List<IssuedTicketResponseDto.Response> getMyTickets(User currentUser)
    {
        return issuedTicketRepository
                .findByBookingUserOrderByIssuedAtDesc(currentUser)
                .stream()
                .map(issuedTicketMapper::toResponse)
                .collect(Collectors.toList());
    }
}