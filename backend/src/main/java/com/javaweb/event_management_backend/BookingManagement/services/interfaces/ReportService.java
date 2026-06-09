package com.javaweb.event_management_backend.BookingManagement.services.interfaces;

import com.javaweb.event_management_backend.BookingManagement.dtos.response.ReportResponseDto;

public interface ReportService {
    ReportResponseDto.DashboardReport getDashboardReport();
}
