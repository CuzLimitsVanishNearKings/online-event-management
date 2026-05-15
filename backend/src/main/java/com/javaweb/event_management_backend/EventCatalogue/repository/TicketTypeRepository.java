package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {

    // Find all ticket types for a specific event
    List<TicketType> findByEvent(Event event);

    // Find all ticket types for an event by event id
    List<TicketType> findByEventEventId(Long eventId);

    // Find ticket types that still have availability
    List<TicketType> findByEventAndQuantityRemainingGreaterThan(Event event, int quantity);

    // Check if a ticket type name already exists for an event
    boolean existsByEventAndNameIgnoreCase(Event event, String name);
}