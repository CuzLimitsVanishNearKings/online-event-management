package com.javaweb.event_management_backend.BookingManagement.repository;

import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings made by a user
    @EntityGraph(attributePaths = {"user", "payment", "issuedTickets", "issuedTickets.ticketType", "issuedTickets.ticketType.event"})
    List<Booking> findByUser(User user);

    // Find all bookings by a user and status
    // e.g "show me all CONFIRMED bookings for this user"
    @EntityGraph(attributePaths = {"user", "payment", "issuedTickets"})
    List<Booking> findByUserAndStatus(User user, BookingStatus status);

    // Find all bookings by status
    // useful for admin dashboard
    @EntityGraph(attributePaths = {"user"})
    List<Booking> findByStatus(BookingStatus status);

    // Find all bookings made between two dates
    // useful for admin reports
    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);

    // Find all bookings by user ordered by most recent first
    List<Booking> findByUserOrderByBookingDateDesc(User user);

    // Count total bookings by status
    // useful for admin dashboard statistics
    long countByStatus(BookingStatus status);

    // Count total bookings by user
    long countByUser(User user);

    // Find all bookings for an organizer's events
    @Query("SELECT DISTINCT b FROM Booking b JOIN b.issuedTickets it JOIN it.ticketType tt JOIN tt.event e WHERE e.organizer = :organizer ORDER BY b.bookingDate DESC")
    List<Booking> findByOrganizer(@Param("organizer") OrganizerProfile organizer);
}