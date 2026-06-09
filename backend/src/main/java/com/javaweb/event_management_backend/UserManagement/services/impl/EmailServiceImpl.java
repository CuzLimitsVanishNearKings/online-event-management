package com.javaweb.event_management_backend.UserManagement.services.impl;

import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.UserManagement.services.interfaces.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        log.info("\n\n=== MOCK EMAIL SERVICE ===");
        log.info("Sending Password Reset Email to: {}", toEmail);
        log.info("Reset Token: {}", token);
        log.info("Reset Link: http://localhost:5173/reset-password?token={}", token);
        log.info("==========================\n\n");
    }

    @Override
    public void sendBookingConfirmationEmail(Booking booking, String toEmail) {
        log.info("\n\n=== MOCK EMAIL SERVICE ===");
        log.info("Sending Booking Confirmation Email to: {}", toEmail);
        log.info("Booking ID: {}", booking.getBookingId());
        log.info("Total Amount: {}", booking.getTotalAmount());
        log.info("Tickets Issued: {}", booking.getIssuedTickets().size());
        log.info("Thank you for your purchase!");
        log.info("==========================\n\n");
    }

    @Override
    public void sendEventCancellationEmail(Event event, String toEmail) {
        log.info("\n\n=== MOCK EMAIL SERVICE ===");
        log.info("Sending Event Cancellation Email to: {}", toEmail);
        log.info("Event Cancelled: {}", event.getTitle());
        log.info("A refund will be processed automatically.");
        log.info("==========================\n\n");
    }

    @Override
    public void sendEventRescheduledEmail(Event event, String toEmail) {
        log.info("\n\n=== MOCK EMAIL SERVICE ===");
        log.info("Sending Event Reschedule Email to: {}", toEmail);
        log.info("Event Rescheduled: {}", event.getTitle());
        log.info("New Date: {} to {}", event.getStartDateTime(), event.getEndDateTime());
        log.info("==========================\n\n");
    }
}
