package com.javaweb.event_management_backend.BookingManagement.services.interfaces;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PaymentRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PaymentResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentService {

    // ─── CLIENT ──────────────────────────────────────────────────

    // Initiate payment for a booking
    // deducts from wallet and confirms booking
    PaymentResponseDto.PaymentResult initiatePayment(PaymentRequestDto.InitiatePayment dto,
                                                     User currentUser);

    // Get payment details for a booking
    PaymentResponseDto.PaymentResult getPaymentByBooking(Long bookingId,
                                                         User currentUser);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get all payments — admin dashboard
    List<PaymentResponseDto.AdminView> getAllPayments();

    // Get all payments by status
    // e.g "show me all FAILED payments"
    List<PaymentResponseDto.AdminView> getPaymentsByStatus(
            com.javaweb.event_management_backend.BookingManagement.enums.PaymentStatus status);

    // Get total revenue — admin dashboard
    BigDecimal getTotalRevenue();

    // Get revenue between two dates — admin reports
    BigDecimal getRevenueBetween(java.time.LocalDateTime start,
                                 java.time.LocalDateTime end);

    // ─── INTERNAL ────────────────────────────────────────────────

    // Process payment — called internally by BookingService
    // deducts wallet balance and creates payment record
    PaymentResponseDto.PaymentResult processPayment(Long bookingId,
                                                    BigDecimal amount,
                                                    User currentUser);

    // Process refund — called internally by BookingService
    // credits wallet balance and updates payment record
    PaymentResponseDto.PaymentResult processRefund(Long bookingId,
                                                   User currentUser);
}