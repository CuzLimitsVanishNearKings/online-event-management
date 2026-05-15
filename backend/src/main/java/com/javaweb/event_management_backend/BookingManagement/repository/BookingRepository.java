package com.javaweb.event_management_backend.BookingManagement.repository;

import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings made by a user
    List<Booking> findByUser(User user);

    // Find all bookings by a user and status
    // e.g "show me all CONFIRMED bookings for this user"
    List<Booking> findByUserAndStatus(User user, BookingStatus status);

    // Find all bookings by status
    // useful for admin dashboard
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
}