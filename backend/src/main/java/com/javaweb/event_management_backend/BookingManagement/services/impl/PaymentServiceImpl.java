package com.javaweb.event_management_backend.BookingManagement.services.impl;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PaymentRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PaymentResponseDto;
import com.javaweb.event_management_backend.BookingManagement.enums.PaymentMethod;
import com.javaweb.event_management_backend.BookingManagement.enums.PaymentStatus;
import com.javaweb.event_management_backend.BookingManagement.mappers.PaymentMapper;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.BookingManagement.models.Payment;
import com.javaweb.event_management_backend.BookingManagement.repository.BookingRepository;
import com.javaweb.event_management_backend.BookingManagement.repository.PaymentRepository;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.PaymentService;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.WalletService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import com.javaweb.event_management_backend.exceptions.InsufficientBalanceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final WalletService walletService;
    private final PaymentMapper paymentMapper;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    @Transactional
    public PaymentResponseDto.PaymentResult initiatePayment(
            PaymentRequestDto.InitiatePayment dto, User currentUser) {

        Booking booking = findBookingById(dto.getBookingId());

        // user can only pay for their own bookings
        if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to pay for this booking");
        }

        return processPayment(
                booking.getBookingId(),
                booking.getTotalAmount(),
                currentUser);
    }

    @Override
    public PaymentResponseDto.PaymentResult getPaymentByBooking(
            Long bookingId, User currentUser) {

        Booking booking = findBookingById(bookingId);

        // user can only view their own payments
        if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view this payment");
        }

        Payment payment = paymentRepository.findByBooking(booking)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking: " + bookingId));

        return paymentMapper.toPaymentResult(payment,
                "Payment " + payment.getStatus().name().toLowerCase());
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public List<PaymentResponseDto.AdminView> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toAdminView)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponseDto.AdminView> getPaymentsByStatus(
            PaymentStatus status) {
        return paymentRepository.findByStatus(status)
                .stream()
                .map(paymentMapper::toAdminView)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal getTotalRevenue() {
        return paymentRepository.calculateTotalRevenue();
    }

    @Override
    public BigDecimal getRevenueBetween(
            LocalDateTime start, LocalDateTime end) {
        return paymentRepository.calculateRevenueBetween(start, end);
    }

    // ─── INTERNAL ────────────────────────────────────────────────

    @Override
    @Transactional
    public PaymentResponseDto.PaymentResult processPayment(
            Long bookingId, BigDecimal amount, User currentUser) {

        Booking booking = findBookingById(bookingId);

        // check wallet balance before deducting
        if (!walletService.hasSufficientBalance(currentUser, amount)) {
            // create failed payment record
            Payment failedPayment = Payment.builder()
                    .booking(booking)
                    .amount(amount)
                    .paymentMethod(PaymentMethod.WALLET)
                    .status(PaymentStatus.FAILED)
                    .build();
            paymentRepository.save(failedPayment);

            throw new InsufficientBalanceException(
                    "Insufficient wallet balance. Required: "
                            + amount + " XAF");
        }

        // deduct from wallet
        walletService.deductBalance(
                currentUser,
                amount,
                "Payment for booking #" + bookingId);

        // create completed payment record
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(amount)
                .paymentMethod(PaymentMethod.WALLET)
                .status(PaymentStatus.COMPLETED)
                .build();
        paymentRepository.save(payment);

        return paymentMapper.toPaymentResult(
                payment,
                "Payment successful. Your tickets have been generated.");
    }

    @Override
    @Transactional
    public PaymentResponseDto.PaymentResult processRefund(
            Long bookingId, User currentUser) {

        Booking booking = findBookingById(bookingId);

        Payment payment = paymentRepository.findByBooking(booking)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking: " + bookingId));

        // credit wallet back
        walletService.creditBalance(
                currentUser,
                payment.getAmount(),
                "Refund for cancelled booking #" + bookingId);

        // update payment status
        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        return paymentMapper.toPaymentResult(
                payment,
                "Refund of " + payment.getAmount()
                        + " XAF successfully credited to your wallet.");
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Booking findBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));
    }
}