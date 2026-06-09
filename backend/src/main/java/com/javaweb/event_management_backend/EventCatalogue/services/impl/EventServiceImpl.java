package com.javaweb.event_management_backend.EventCatalogue.services.impl;

import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.BookingManagement.repository.BookingRepository;
import com.javaweb.event_management_backend.EventCatalogue.dtos.request.EventRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.EventResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.mappers.EventMapper;
import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.models.IssuedTicket;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.EventCatalogue.repository.CategoryRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.IssuedTicketRepository;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.BookingService;
import com.javaweb.event_management_backend.EventCatalogue.repository.TicketTypeRepository;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.EventService;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import com.javaweb.event_management_backend.UserManagement.services.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Lazy;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final OrganizerRepository organizerRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final IssuedTicketRepository issuedTicketRepository;
    private final EventMapper eventMapper;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    // ─── PUBLIC ─────────────────────────────────────────────────

    @Override
    public Page<EventResponseDto.Summary> getAllPublishedEvents(Pageable pageable) {
        return eventRepository.findByStatus(EventStatus.PUBLISHED, pageable)
                .map(eventMapper::toSummary);
    }

    @Override
    public EventResponseDto.Detail getEventById(Long eventId) {
        Event event = eventRepository.findWithDetailsByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));
        return eventMapper.toDetail(event);
    }

    @Override
    public List<EventResponseDto.Summary> searchEvents(String keyword) {
        return eventRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .filter(e -> e.getStatus() == EventStatus.PUBLISHED)
                .map(eventMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDto.Summary> getEventsByCategory(String categoryName) {
        return eventRepository.findByCategoryName(categoryName)
                .stream()
                .filter(e -> e.getStatus() == EventStatus.PUBLISHED)
                .map(eventMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDto.Summary> filterEvents(String keyword, String category, String venue, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        org.springframework.data.jpa.domain.Specification<Event> spec =
            com.javaweb.event_management_backend.EventCatalogue.repository.EventSpecification.filterEvents(keyword, category, venue, startDate, endDate, minPrice, maxPrice);

        return eventRepository.findAll(spec)
                .stream()
                .map(eventMapper::toSummary)
                .collect(Collectors.toList());
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    @Override
    @Transactional
    public EventResponseDto.Detail createEvent(EventRequestDto.CreateEvent dto,
                                               User currentUser) {
        // get organizer profile
        OrganizerProfile organizer = organizerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizer profile not found for user: "
                                + currentUser.getEmail()));

        // get category
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + dto.getCategoryId()));

        // validate dates
        if (dto.getEndDateTime().isBefore(dto.getStartDateTime())) {
            throw new IllegalArgumentException(
                    "End date must be after start date");
        }

        // build event
        Event event = eventMapper.toEntity(dto);
        event.setCategory(category);
        event.setOrganizer(organizer);
        event.setStatus(EventStatus.DRAFT);

        eventRepository.save(event);
        return eventMapper.toDetail(event);
    }

    @Override
    @Transactional
    public EventResponseDto.Detail updateEvent(Long eventId,
                                               EventRequestDto.UpdateEvent dto,
                                               User currentUser) {
        Event event = findEventById(eventId);

        // verify ownership
        verifyOwnership(event, currentUser);

        // update category if provided
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + dto.getCategoryId()));
            event.setCategory(category);
        }

        // validate dates if both provided
        if (dto.getStartDateTime() != null && dto.getEndDateTime() != null
                && dto.getEndDateTime().isBefore(dto.getStartDateTime())) {
            throw new IllegalArgumentException(
                    "End date must be after start date");
        }

        eventMapper.updateEntity(dto, event);
        eventRepository.save(event);
        return eventMapper.toDetail(event);
    }

    @Override
    @Transactional
    public void deleteEvent(Long eventId, User currentUser) {
        Event event = findEventById(eventId);
        verifyOwnership(event, currentUser);

        // only DRAFT events can be deleted
        if (event.getStatus() != EventStatus.DRAFT) {
            throw new IllegalArgumentException(
                    "Only DRAFT events can be deleted. "
                            + "Cancel the event instead.");
        }

        eventRepository.delete(event);
    }

    @Override
    @Transactional
    public EventResponseDto.Detail publishEvent(Long eventId, User currentUser) {
        Event event = findEventById(eventId);
        verifyOwnership(event, currentUser);

        // only DRAFT events can be published
        if (event.getStatus() != EventStatus.DRAFT) {
            throw new IllegalArgumentException(
                    "Only DRAFT events can be published");
        }

        // must have at least one ticket type before publishing
        if (event.getTicketTypes().isEmpty()) {
            throw new IllegalArgumentException(
                    "Event must have at least one ticket type before publishing");
        }

        event.setStatus(EventStatus.PUBLISHED);
        eventRepository.save(event);
        return eventMapper.toDetail(event);
    }

    @Override
    @Transactional
    public EventResponseDto.Detail cancelEvent(Long eventId, User currentUser) {
        Event event = findEventById(eventId);
        verifyOwnership(event, currentUser);

        // only PUBLISHED or RESCHEDULED events can be cancelled
        if (event.getStatus() != EventStatus.PUBLISHED
                && event.getStatus() != EventStatus.RESCHEDULED) {
            throw new IllegalArgumentException(
                    "Only PUBLISHED or RESCHEDULED events can be cancelled");
        }

        // Cancel all associated bookings (FR-11)

        event.getTicketTypes().stream()
                .flatMap(tt -> issuedTicketRepository.findByTicketType(tt).stream())
                .map(IssuedTicket::getBooking)
                .distinct()
                .forEach(booking -> {
                    if (booking.getStatus() == BookingStatus.CONFIRMED) {
                        booking.setStatus(BookingStatus.CANCELLED);
                        bookingRepository.save(booking);
                    }
                });

        // Send cancellation emails (FR-25)
        event.getTicketTypes().stream()
                .flatMap(tt -> tt.getIssuedTickets().stream())
                .map(ticket -> ticket.getBooking().getUser().getEmail())
                .distinct()
                .forEach(email -> {
                    try {
                        emailService.sendEventCancellationEmail(event, email);
                    } catch (Exception e) {
                        // ignore email errors
                    }
                });

        event.setStatus(EventStatus.CANCELLED);
        eventRepository.save(event);
        return eventMapper.toDetail(event);
    }

    @Override
    @Transactional
    public EventResponseDto.Detail rescheduleEvent(Long eventId,
                                                   EventRequestDto.UpdateEvent dto,
                                                   User currentUser) {
        Event event = findEventById(eventId);
        verifyOwnership(event, currentUser);

        // only PUBLISHED events can be rescheduled
        if (event.getStatus() != EventStatus.PUBLISHED) {
            throw new IllegalArgumentException(
                    "Only PUBLISHED events can be rescheduled");
        }

        // dates are required for rescheduling
        if (dto.getStartDateTime() == null || dto.getEndDateTime() == null) {
            throw new IllegalArgumentException(
                    "Start and end dates are required for rescheduling");
        }

        if (dto.getEndDateTime().isBefore(dto.getStartDateTime())) {
            throw new IllegalArgumentException(
                    "End date must be after start date");
        }

        eventMapper.updateEntity(dto, event);
        event.setStatus(EventStatus.RESCHEDULED);

        // Send rescheduled emails (FR-26)
        event.getTicketTypes().stream()
                .flatMap(tt -> tt.getIssuedTickets().stream())
                .map(ticket -> ticket.getBooking().getUser().getEmail())
                .distinct()
                .forEach(email -> {
                    try {
                        emailService.sendEventRescheduledEmail(event, email);
                    } catch (Exception e) {
                        // ignore email errors
                    }
                });

        eventRepository.save(event);
        return eventMapper.toDetail(event);
    }

    @Override
    public List<EventResponseDto.OrganizerView> getOrganizerEvents(User currentUser) {
        OrganizerProfile organizer = organizerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizer profile not found for user: "
                                + currentUser.getEmail()));

        // fetch all ticket sold counts in one query
        Map<Long, Integer> soldByEvent = issuedTicketRepository
                .countSoldTicketsByOrganizer(organizer)
                .stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> ((Number) row[1]).intValue()
                ));

        return eventRepository.findByOrganizer(organizer)
                .stream()
                .map(event -> {
                    Integer totalSold = soldByEvent.getOrDefault(event.getEventId(), 0);
                    Integer totalRemaining = calculateTotalTicketsRemaining(event);
                    BigDecimal totalRevenue = calculateTotalRevenue(event);

                    return eventMapper.toOrganizerView(
                            event, totalSold, totalRemaining, totalRevenue);
                })
                .collect(Collectors.toList());
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public Page<EventResponseDto.Summary> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable)
                .map(eventMapper::toSummary);
    }

    @Override
    @Transactional
    public void adminDeleteEvent(Long eventId) {
        Event event = findEventById(eventId);

        // Cancel all associated bookings (if not already cancelled)
        if (event.getStatus() == EventStatus.PUBLISHED || event.getStatus() == EventStatus.RESCHEDULED) {

            event.getTicketTypes().stream()
                    .flatMap(tt -> issuedTicketRepository.findByTicketType(tt).stream())
                    .map(IssuedTicket::getBooking)
                    .distinct()
                    .forEach(booking -> {
                        if (booking.getStatus() == BookingStatus.CONFIRMED) {
                            booking.setStatus(BookingStatus.CANCELLED);
                            bookingRepository.save(booking);
                        }
                    });

            // Send cancellation emails
            event.getTicketTypes().stream()
                    .flatMap(tt -> tt.getIssuedTickets().stream())
                    .map(ticket -> ticket.getBooking().getUser().getEmail())
                    .distinct()
                    .forEach(email -> {
                        try {
                            emailService.sendEventCancellationEmail(event, email);
                        } catch (Exception e) {
                            // ignore email errors
                        }
                    });
        }

        eventRepository.delete(event);
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    // fetch event or throw
    private Event findEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));
    }

    // verify current user owns the event
    private void verifyOwnership(Event event, User currentUser) {
        if (!event.getOrganizer().getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to modify this event");
        }
    }

    // calculate total tickets sold for an event
    private Integer calculateTotalTicketsSold(Event event) {
        return event.getTicketTypes()
                .stream()
                .mapToInt(tt -> (int) issuedTicketRepository
                        .countByTicketTypeAndStatus(tt, IssuedTicketStatus.VALID))
                .sum();
    }

    // calculate total tickets remaining for an event
    private Integer calculateTotalTicketsRemaining(Event event) {
        return event.getTicketTypes()
                .stream()
                .mapToInt(TicketType::getQuantityRemaining)
                .sum();
    }

    // calculate total revenue for an event
    private BigDecimal calculateTotalRevenue(Event event) {
        return event.getTicketTypes()
                .stream()
                .map(tt -> tt.getPrice().multiply(
                        BigDecimal.valueOf(
                                tt.getQuantity() - tt.getQuantityRemaining())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}