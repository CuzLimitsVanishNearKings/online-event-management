package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    // Override findAll to eagerly fetch relations
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    Page<Event> findAll(Pageable pageable);

    // Find events by organizer
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByOrganizer(OrganizerProfile organizer);

    // Find events by status
    @EntityGraph(attributePaths = {"category"})
    Page<Event> findByStatus(EventStatus status, Pageable pageable);



    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    Optional<Event> findWithDetailsByEventId(Long id);

    long countByStatus(EventStatus status);
    // Find events by category
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByCategoryName(String categoryName);

    // Search events by title keyword
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByTitleContainingIgnoreCase(String keyword);

    // Find events starting after a given date
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByStartDateTimeAfter(LocalDateTime date);

    // Find events starting between two dates
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByStartDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find events by organizer and status
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByOrganizerAndStatus(OrganizerProfile organizer, EventStatus status);

    // Find events by venue keyword
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByVenueContainingIgnoreCase(String venue);

    // Find published events by category and status combined
    @EntityGraph(attributePaths = {"category", "organizer", "ticketTypes"})
    List<Event> findByCategoryNameAndStatus(String categoryName, EventStatus status);
}