package com.javaweb.event_management_backend.BookingManagement.repository;

import com.javaweb.event_management_backend.BookingManagement.enums.PaymentStatus;
import com.javaweb.event_management_backend.BookingManagement.enums.PaymentMethod;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.BookingManagement.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by its booking — since it's OneToOne
    Optional<Payment> findByBooking(Booking booking);

    // Find payment by booking id directly
    Optional<Payment> findByBookingBookingId(Long bookingId);

    // Find all payments by status
    // useful for admin dashboard
    List<Payment> findByStatus(PaymentStatus status);

    // Find all payments made between two dates
    // useful for revenue reports
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    // Find all payments by status between two dates
    // e.g "show me all COMPLETED payments this month"
    List<Payment> findByStatusAndPaymentDateBetween(
            PaymentStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

    // Count payments by status
    long countByStatus(PaymentStatus status);

    // Calculate total revenue — sum of all COMPLETED payments
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    // Calculate total revenue between two dates
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'COMPLETED' " +
            "AND p.paymentDate BETWEEN :start AND :end")
    BigDecimal calculateRevenueBetween(LocalDateTime start, LocalDateTime end);
}