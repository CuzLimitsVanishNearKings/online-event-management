package com.javaweb.event_management_backend.UserManagement.services.interfaces;

import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String token);
    void sendBookingConfirmationEmail(Booking booking, String toEmail);
    void sendEventCancellationEmail(Event event, String toEmail);
    void sendEventRescheduledEmail(Event event, String toEmail);
}
