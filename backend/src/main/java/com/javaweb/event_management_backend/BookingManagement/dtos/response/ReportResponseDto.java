package com.javaweb.event_management_backend.BookingManagement.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ReportResponseDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DashboardReport {
        private BigDecimal totalRevenue;
        private long totalUsers;
        private long totalEvents;
        private double eventSuccessRate; // Percentage
        private List<TopSellingEvent> topSellingEvents;
        private Map<String, BigDecimal> revenueByCategory;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopSellingEvent {
        private Long eventId;
        private String eventName;
        private int ticketsSold;
        private BigDecimal revenue;
    }
}
