package com.javaweb.event_management_backend.BookingManagement.controllers;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PaymentRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PaymentResponseDto;
import com.javaweb.event_management_backend.BookingManagement.enums.PaymentStatus;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.PaymentService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // POST /api/payments/initiate
    // initiate payment for a booking
    @PostMapping("/initiate")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<PaymentResponseDto.PaymentResult> initiatePayment(
            @Valid @RequestBody PaymentRequestDto.InitiatePayment dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                paymentService.initiatePayment(dto, currentUser));
    }

    // GET /api/payments/booking/{bookingId}
    // get payment details for a booking
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<PaymentResponseDto.PaymentResult> getPaymentByBooking(
            @PathVariable Long bookingId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                paymentService.getPaymentByBooking(bookingId, currentUser));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/payments
    // get all payments — admin dashboard
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponseDto.AdminView>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET /api/payments/status/{status}
    // get payments by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponseDto.AdminView>> getPaymentsByStatus(
            @PathVariable PaymentStatus status) {
        return ResponseEntity.ok(
                paymentService.getPaymentsByStatus(status));
    }

    // GET /api/payments/revenue
    // get total revenue
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getTotalRevenue() {
        return ResponseEntity.ok(Map.of(
                "totalRevenue", paymentService.getTotalRevenue()));
    }

    // GET /api/payments/revenue/range?start=...&end=...
    // get revenue between two dates
    @GetMapping("/revenue/range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getRevenueBetween(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(Map.of(
                "totalRevenue",
                paymentService.getRevenueBetween(start, end)));
    }
}