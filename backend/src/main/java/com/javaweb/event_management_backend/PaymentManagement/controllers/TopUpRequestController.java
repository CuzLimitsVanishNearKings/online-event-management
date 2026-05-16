package com.javaweb.event_management_backend.PaymentManagement.controllers;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.TopUpRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.TopUpRequestResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.TopUpRequestService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.config.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/top-up-requests")
@RequiredArgsConstructor
public class TopUpRequestController {

    private final TopUpRequestService topUpRequestService;

    // ─── CLIENT ──────────────────────────────────────────────────

    // POST /api/top-up-requests
    // submit a new top up request
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<TopUpRequestResponseDto.Summary> createTopUpRequest(
            @Valid @RequestBody TopUpRequestDto.CreateTopUpRequest dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(topUpRequestService.createTopUpRequest(
                        dto, currentUser));
    }

    // GET /api/top-up-requests/my-requests
    // get all top up requests for current user
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<TopUpRequestResponseDto.Summary>>
    getMyTopUpRequests() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                topUpRequestService.getMyTopUpRequests(currentUser));
    }

    // GET /api/top-up-requests/{requestId}
    // get a specific top up request
    @GetMapping("/{requestId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<TopUpRequestResponseDto.Summary> getTopUpRequestById(
            @PathVariable Long requestId) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                topUpRequestService.getTopUpRequestById(
                        requestId, currentUser));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/top-up-requests
    // get all top up requests — admin dashboard
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TopUpRequestResponseDto.AdminView>>
    getAllTopUpRequests() {
        return ResponseEntity.ok(
                topUpRequestService.getAllTopUpRequests());
    }

    // GET /api/top-up-requests/pending
    // get all pending top up requests
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TopUpRequestResponseDto.AdminView>>
    getPendingTopUpRequests() {
        return ResponseEntity.ok(
                topUpRequestService.getPendingTopUpRequests());
    }

    // GET /api/top-up-requests/pending/count
    // count pending requests — notification badge
    @GetMapping("/pending/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countPendingRequests() {
        return ResponseEntity.ok(Map.of(
                "pendingCount",
                topUpRequestService.countPendingRequests()));
    }

    // POST /api/top-up-requests/review
    // approve or reject a top up request
    @PostMapping("/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TopUpRequestResponseDto.ReviewResult> reviewTopUpRequest(
            @Valid @RequestBody TopUpRequestDto.ReviewTopUpRequest dto) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(
                topUpRequestService.reviewTopUpRequest(dto, currentUser));
    }
}