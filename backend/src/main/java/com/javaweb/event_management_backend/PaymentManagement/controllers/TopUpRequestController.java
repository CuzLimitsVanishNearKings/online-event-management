package com.javaweb.event_management_backend.PaymentManagement.controllers;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.TopUpRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.TopUpRequestResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.TopUpRequestService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/top-up-requests")
@RequiredArgsConstructor
public class TopUpRequestController
{
    private final TopUpRequestService topUpRequestService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // POST /api/top-up-requests
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<TopUpRequestResponseDto.Summary> createTopUpRequest(
            @Valid @RequestBody TopUpRequestDto.CreateTopUpRequest dto)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(topUpRequestService.createTopUpRequest(dto, currentUser));
    }

    // GET /api/top-up-requests/my-requests?page=0&size=10
    @GetMapping("/my-requests")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<Page<TopUpRequestResponseDto.Summary>> getMyTopUpRequests( @ParameterObject
            Pageable pageable)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                topUpRequestService.getMyTopUpRequests(currentUser, pageable));
    }

    // GET /api/top-up-requests/{requestId}
    @GetMapping("/{requestId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ORGANIZER')")
    public ResponseEntity<TopUpRequestResponseDto.Summary> getTopUpRequestById(
            @PathVariable Long requestId)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                topUpRequestService.getTopUpRequestById(requestId, currentUser));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/top-up-requests?page=0&size=10
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TopUpRequestResponseDto.AdminView>> getAllTopUpRequests( @ParameterObject
            Pageable pageable)
    {
        return ResponseEntity.ok(
                topUpRequestService.getAllTopUpRequests(pageable));
    }

    // GET /api/top-up-requests/pending?page=0&size=10
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TopUpRequestResponseDto.AdminView>> getPendingTopUpRequests( @ParameterObject
            Pageable pageable)
    {
        return ResponseEntity.ok(
                topUpRequestService.getPendingTopUpRequests(pageable));
    }

    // GET /api/top-up-requests/pending/count
    @GetMapping("/pending/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countPendingRequests()
    {
        return ResponseEntity.ok(Map.of(
                "pendingCount",
                topUpRequestService.countPendingRequests()));
    }

    // POST /api/top-up-requests/review
    @PostMapping("/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TopUpRequestResponseDto.ReviewResult> reviewTopUpRequest(
            @Valid @RequestBody TopUpRequestDto.ReviewTopUpRequest dto)
    {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                topUpRequestService.reviewTopUpRequest(dto, currentUser));
    }
}