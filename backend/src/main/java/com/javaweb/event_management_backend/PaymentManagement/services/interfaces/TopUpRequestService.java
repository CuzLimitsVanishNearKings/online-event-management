package com.javaweb.event_management_backend.PaymentManagement.services.interfaces;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.TopUpRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.TopUpRequestResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TopUpRequestService
{
    // ─── CLIENT ──────────────────────────────────────────────────

    // Submit a new top up request
    TopUpRequestResponseDto.Summary createTopUpRequest(
            TopUpRequestDto.CreateTopUpRequest dto,
            User currentUser);

    // Get all top up requests for current user
    // newest first, paginated
    Page<TopUpRequestResponseDto.Summary> getMyTopUpRequests(
            User currentUser, Pageable pageable);

    // Get a specific top up request by id
    TopUpRequestResponseDto.Summary getTopUpRequestById(
            Long requestId, User currentUser);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get all top up requests — admin dashboard, paginated
    Page<TopUpRequestResponseDto.AdminView> getAllTopUpRequests(
            Pageable pageable);

    // Get all pending top up requests
    // admin sees newest requests first, paginated
    Page<TopUpRequestResponseDto.AdminView> getPendingTopUpRequests(
            Pageable pageable);

    // Approve or reject a top up request
    // if approved → wallet credited automatically
    TopUpRequestResponseDto.ReviewResult reviewTopUpRequest(
            TopUpRequestDto.ReviewTopUpRequest dto,
            User admin);

    // Count pending top up requests
    // powers admin dashboard notification badge
    long countPendingRequests();
}