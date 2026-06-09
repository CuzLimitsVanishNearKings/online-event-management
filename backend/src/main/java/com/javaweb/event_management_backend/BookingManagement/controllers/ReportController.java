package com.javaweb.event_management_backend.BookingManagement.controllers;

import com.javaweb.event_management_backend.BookingManagement.dtos.response.ReportResponseDto;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponseDto.DashboardReport> getDashboardReport() {
        return ResponseEntity.ok(reportService.getDashboardReport());
    }
}
