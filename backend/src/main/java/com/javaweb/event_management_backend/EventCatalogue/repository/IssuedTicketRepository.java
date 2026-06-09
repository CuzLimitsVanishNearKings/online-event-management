package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.IssuedTicket;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssuedTicketRepository extends JpaRepository<IssuedTicket, Long> {

    // Find a ticket by its unique QR code — used at door scanning
    Optional<IssuedTicket> findByQrCode(String qrCode);

    // Find all tickets belonging to a booking
    List<IssuedTicket> findByBooking(Booking booking);

    // Find all tickets for a specific ticket type
    List<IssuedTicket> findByTicketType(TicketType ticketType);

    // Find all tickets by status
    List<IssuedTicket> findByStatus(IssuedTicketStatus status);

    // Find all tickets for a booking by status
    // e.g "show me all VALID tickets in booking #12"
    List<IssuedTicket> findByBookingAndStatus(Booking booking, IssuedTicketStatus status);

    // Count how many tickets have been issued for a ticket type
    // used to track sales
    long countByTicketType(TicketType ticketType);

    // Count how many VALID tickets exist for a ticket type
    // used to verify remaining capacity
    long countByTicketTypeAndStatus(TicketType ticketType, IssuedTicketStatus status);

    // Check if a QR code already exists — prevents duplicates
    boolean existsByQrCode(String qrCode);

    // Find ticket by manual code — used for keyboard entry verification
    Optional<IssuedTicket> findByTicketCode(String ticketCode);

    // Check if ticket code already exists — prevents duplicates
    boolean existsByTicketCode(String ticketCode);

    // Find all tickets for a user across all bookings
// used for client's ticket history page
    List<IssuedTicket> findByBookingUserOrderByIssuedAtDesc(User user);

    // Count tickets by ticket type and multiple statuses
// used to calculate total sold (VALID + USED)
    long countByTicketTypeAndStatusIn(TicketType ticketType, List<IssuedTicketStatus> statuses);
}