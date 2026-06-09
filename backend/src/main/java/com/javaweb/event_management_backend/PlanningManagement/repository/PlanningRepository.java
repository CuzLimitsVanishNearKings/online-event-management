package com.javaweb.event_management_backend.PlanningManagement.repository;

import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.PlanningManagement.models.Planning;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long>
{
    // Find all saved events for a user — ordered by most recently saved
    List<Planning> findByUserOrderBySavedAtDesc(User user);

    // Find a specific saved event for a user
    Optional<Planning> findByUserAndEvent(User user, Event event);

    // Check if a user already saved a specific event
    boolean existsByUserAndEvent(User user, Event event);

    // Remove a saved event for a user
    void deleteByUserAndEvent(User user, Event event);

    // Count how many users saved a specific event
    // useful for event popularity stats
    long countByEvent(Event event);
}