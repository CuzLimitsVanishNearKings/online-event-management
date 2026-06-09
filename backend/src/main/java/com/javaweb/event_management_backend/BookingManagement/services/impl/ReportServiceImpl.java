package com.javaweb.event_management_backend.BookingManagement.services.impl;

import com.javaweb.event_management_backend.BookingManagement.dtos.response.ReportResponseDto;
import com.javaweb.event_management_backend.BookingManagement.enums.BookingStatus;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.BookingManagement.repository.BookingRepository;
import com.javaweb.event_management_backend.BookingManagement.repository.PaymentRepository;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.ReportService;
import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.UserManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    @Override
    public ReportResponseDto.DashboardReport getDashboardReport() {
        BigDecimal totalRevenue = paymentRepository.calculateTotalRevenue();
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();

        long successfulEventsCount = eventRepository.count() - eventRepository.findByStatus(EventStatus.CANCELLED).size();
        double successRate = totalEvents > 0 ? (double) successfulEventsCount / totalEvents * 100 : 0;

        List<Booking> confirmedBookings = bookingRepository.findByStatus(BookingStatus.CONFIRMED);

        Map<Long, ReportResponseDto.TopSellingEvent> eventStats = new HashMap<>();
        Map<String, BigDecimal> categoryRevenue = new HashMap<>();

        for (Booking b : confirmedBookings) {
            if (b.getIssuedTickets() == null || b.getIssuedTickets().isEmpty()) continue;
            
            Event event = b.getIssuedTickets().get(0).getTicketType().getEvent();
            String categoryName = event.getCategory() != null ? event.getCategory().getName() : "Uncategorized";
            
            // Add revenue to category
            categoryRevenue.merge(categoryName, b.getTotalAmount(), BigDecimal::add);
            
            // Add to event stats
            ReportResponseDto.TopSellingEvent dto = eventStats.computeIfAbsent(event.getEventId(), 
                id -> new ReportResponseDto.TopSellingEvent(event.getEventId(), event.getTitle(), 0, BigDecimal.ZERO));
                
            dto.setTicketsSold(dto.getTicketsSold() + b.getIssuedTickets().size());
            dto.setRevenue(dto.getRevenue().add(b.getTotalAmount()));
        }

        List<ReportResponseDto.TopSellingEvent> topSellingEvents = eventStats.values().stream()
                .sorted(Comparator.comparing(ReportResponseDto.TopSellingEvent::getRevenue).reversed())
                .limit(5)
                .collect(Collectors.toList());

        return ReportResponseDto.DashboardReport.builder()
                .totalRevenue(totalRevenue)
                .totalUsers(totalUsers)
                .totalEvents(totalEvents)
                .eventSuccessRate(Math.round(successRate * 10.0) / 10.0) // 1 decimal place
                .topSellingEvents(topSellingEvents)
                .revenueByCategory(categoryRevenue)
                .build();
    }
}
