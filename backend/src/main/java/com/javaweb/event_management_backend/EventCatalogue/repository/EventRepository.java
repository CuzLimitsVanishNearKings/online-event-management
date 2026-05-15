package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events by organizer
    List<Event> findByOrganizer(OrganizerProfile organizer);

    // Find events by status
    List<Event> findByStatus(EventStatus status);

    // Find events by category
    List<Event> findByCategoryName(String categoryName);

    // Search events by title keyword
    List<Event> findByTitleContainingIgnoreCase(String keyword);

    // Find events starting after a given date
    List<Event> findByStartDateTimeAfter(LocalDateTime date);

    // Find events starting between two dates
    List<Event> findByStartDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find events by organizer and status
    List<Event> findByOrganizerAndStatus(OrganizerProfile organizer, EventStatus status);

    // Find events by venue keyword
    List<Event> findByVenueContainingIgnoreCase(String venue);
}