package com.javaweb.event_management_backend.BookingManagement.services.impl;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.BookingRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.BookingResponseDto;
import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.BookingManagement.mappers.BookingMapper;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.BookingManagement.models.Promotion;
import com.javaweb.event_management_backend.BookingManagement.repository.BookingRepository;
import com.javaweb.event_management_backend.BookingManagement.repository.PromotionRepository;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.BookingService;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.PaymentService;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.PromotionService;
import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.IssuedTicket;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.EventCatalogue.repository.IssuedTicketRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.TicketTypeRepository;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.IssuedTicketService;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.exceptions.EventCapacityExceededException;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final IssuedTicketRepository issuedTicketRepository;
    private final PromotionRepository promotionRepository;
    private final OrganizerRepository organizerRepository;
    private final BookingMapper bookingMapper;
    private final PaymentService paymentService;
    private final PromotionService promotionService;
    private final IssuedTicketService issuedTicketService;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    @Transactional
    public BookingResponseDto.Detail createBooking(
            BookingRequestDto.CreateBooking dto, User currentUser) {

        // get ticket type
        TicketType ticketType = ticketTypeRepository.findById(dto.getTicketTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket type not found with id: "
                                + dto.getTicketTypeId()));

        // verify event is published
        if (ticketType.getEvent().getStatus() != EventStatus.PUBLISHED) {
            throw new IllegalArgumentException(
                    "Cannot book tickets for a "
                            + ticketType.getEvent().getStatus() + " event");
        }

        // verify enough tickets remaining
        if (ticketType.getQuantityRemaining() < dto.getQuantity()) {
            throw new EventCapacityExceededException(
                    "Only " + ticketType.getQuantityRemaining()
                            + " tickets remaining for "
                            + ticketType.getName());
        }

        // calculate subtotal
        BigDecimal subtotal = ticketType.getPrice()
                .multiply(BigDecimal.valueOf(dto.getQuantity()));

        // apply promotion if provided
        BigDecimal discount = BigDecimal.ZERO;
        Promotion promotion = null;

        if (dto.getPromotionCode() != null
                && !dto.getPromotionCode().isBlank()) {
            promotion = promotionRepository
                    .findByCode(dto.getPromotionCode().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Promotion not found with code: "
                                    + dto.getPromotionCode()));

            discount = promotionService.applyPromotion(
                    dto.getPromotionCode(), subtotal);
        }

        // calculate total amount
        BigDecimal totalAmount = subtotal.subtract(discount);

        // create booking
        Booking booking = Booking.builder()
                .user(currentUser)
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .promotion(promotion)
                .build();

        bookingRepository.save(booking);

        // process payment
        paymentService.processPayment(
                booking.getBookingId(), totalAmount, currentUser);

        // generate tickets
        issuedTicketService.generateTickets(
                booking.getBookingId(),
                ticketType.getTicketTypeId(),
                dto.getQuantity());

        // confirm booking
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return bookingMapper.toDetail(booking);
    }

    @Override
    @Transactional
    public BookingResponseDto.Detail cancelBooking(
            BookingRequestDto.CancelBooking dto, User currentUser) {

        Booking booking = findBookingById(dto.getBookingId());

        // user can only cancel their own bookings
        if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to cancel this booking");
        }

        // only CONFIRMED bookings can be cancelled
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Only CONFIRMED bookings can be cancelled");
        }

        // process refund
        paymentService.processRefund(booking.getBookingId(), currentUser);

        // cancel all issued tickets
        booking.getIssuedTickets().forEach(ticket -> {
            ticket.setStatus(IssuedTicketStatus.CANCELLED);
            issuedTicketRepository.save(ticket);

            // restore quantity remaining on ticket type
            TicketType ticketType = ticket.getTicketType();
            ticketType.setQuantityRemaining(
                    ticketType.getQuantityRemaining() + 1);
            ticketTypeRepository.save(ticketType);
        });

        // cancel booking
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return bookingMapper.toDetail(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto.Summary> getMyBookings(User currentUser) {
        return bookingRepository
                .findByUserOrderByBookingDateDesc(currentUser)
                .stream()
                .map(bookingMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto.Detail getBookingById(
            Long bookingId, User currentUser) {

        Booking booking = findBookingById(bookingId);

        // user can only view their own bookings
        if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view this booking");
        }

        return bookingMapper.toDetail(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto.Summary> getMyBookingsByStatus(
            BookingStatus status, User currentUser) {
        return bookingRepository.findByUserAndStatus(currentUser, status)
                .stream()
                .map(bookingMapper::toSummary)
                .collect(Collectors.toList());
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto.Summary> getBookingsByEvent(
            Long eventId, User currentUser)
    {
        // verify organizer owns the event
        organizerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizer profile not found"));

        // get ALL ticket types for the event
        List<TicketType> ticketTypes = ticketTypeRepository
                .findByEventEventId(eventId);

        if (ticketTypes.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No ticket types found for event: " + eventId);
        }

        // get all bookings across ALL ticket types
        return ticketTypes.stream()
                .flatMap(tt -> issuedTicketRepository
                        .findByTicketType(tt).stream())
                .map(IssuedTicket::getBooking)
                .distinct()
                .map(bookingMapper::toSummary)
                .collect(Collectors.toList());
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto.Summary> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto.Summary> getAllBookingsByStatus(
            BookingStatus status) {
        return bookingRepository.findByStatus(status)
                .stream()
                .map(bookingMapper::toSummary)
                .collect(Collectors.toList());
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Booking findBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));
    }
}