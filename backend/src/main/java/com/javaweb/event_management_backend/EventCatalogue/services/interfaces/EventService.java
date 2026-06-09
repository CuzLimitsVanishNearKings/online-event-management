package com.javaweb.event_management_backend.EventCatalogue.services.interfaces;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.EventRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.EventResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface EventService {

    // ─── PUBLIC ─────────────────────────────────────────────────

    // Get all published events — browse page
    Page<EventResponseDto.Summary> getAllPublishedEvents(Pageable pageable);

    // Get event full details — event page
    EventResponseDto.Detail getEventById(Long eventId);

    // Search events by keyword
    List<EventResponseDto.Summary> searchEvents(String keyword);

    // Filter events by category
    List<EventResponseDto.Summary> getEventsByCategory(String categoryName);

    // Advanced dynamic filter for events
    List<EventResponseDto.Summary> filterEvents(String keyword, String category, String venue, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice);

    // ─── ORGANIZER ───────────────────────────────────────────────

    // Create a new event
    EventResponseDto.Detail createEvent(EventRequestDto.CreateEvent dto,
                                        User currentUser);

    // Update an existing event
    EventResponseDto.Detail updateEvent(Long eventId,
                                        EventRequestDto.UpdateEvent dto,
                                        User currentUser);

    // Delete an event
    void deleteEvent(Long eventId, User currentUser);

    // Publish a draft event
    EventResponseDto.Detail publishEvent(Long eventId, User currentUser);

    // Cancel an event
    EventResponseDto.Detail cancelEvent(Long eventId, User currentUser);

    // Reschedule an event
    EventResponseDto.Detail rescheduleEvent(Long eventId,
                                            EventRequestDto.UpdateEvent dto,
                                            User currentUser);

    // Get all events by organizer — organizer dashboard
    List<EventResponseDto.OrganizerView> getOrganizerEvents(User currentUser);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get all events regardless of status — admin dashboard
    Page<EventResponseDto.Summary> getAllEvents(Pageable pageable);

    // Delete/Cancel an event as admin
    void adminDeleteEvent(Long eventId);
}