package com.javaweb.event_management_backend.EventCatalogue.services.impl;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.EventRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.EventResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.mappers.EventMapper;
import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.EventCatalogue.repository.CategoryRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.IssuedTicketRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.TicketTypeRepository;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.EventService;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final OrganizerRepository organizerRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final IssuedTicketRepository issuedTicketRepository;
    private final EventMapper eventMapper;

    // ─── PUBLIC ─────────────────────────────────────────────────

    @Override
    public List<EventResponseDto.Summary> getAllPublishedEvents() {
        return eventRepository.findByStatus(EventStatus.PUBLISHED)
                .stream()
                .map(eventMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDto.Detail getEventById(Long eventId) {
        Event event = findEventById(eventId);
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
        eventRepository.save(event);
        return eventMapper.toDetail(event);
    }

    @Override
    public List<EventResponseDto.OrganizerView> getOrganizerEvents(User currentUser) {
        OrganizerProfile organizer = organizerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizer profile not found for user: "
                                + currentUser.getEmail()));

        return eventRepository.findByOrganizer(organizer)
                .stream()
                .map(event -> {
                    // calculate stats for each event
                    Integer totalSold = calculateTotalTicketsSold(event);
                    Integer totalRemaining = calculateTotalTicketsRemaining(event);
                    BigDecimal totalRevenue = calculateTotalRevenue(event);

                    return eventMapper.toOrganizerView(
                            event, totalSold, totalRemaining, totalRevenue);
                })
                .collect(Collectors.toList());
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public List<EventResponseDto.Summary> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(eventMapper::toSummary)
                .collect(Collectors.toList());
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