package com.javaweb.event_management_backend.PaymentManagement.services.interfaces;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.TopUpRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.TopUpRequestResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.util.List;

public interface TopUpRequestService {

    // ─── CLIENT ──────────────────────────────────────────────────

    // Submit a new top up request
    TopUpRequestResponseDto.Summary createTopUpRequest(
            TopUpRequestDto.CreateTopUpRequest dto,
            User currentUser);

    // Get all top up requests for current user
    List<TopUpRequestResponseDto.Summary> getMyTopUpRequests(User currentUser);

    // Get a specific top up request by id
    TopUpRequestResponseDto.Summary getTopUpRequestById(Long requestId,
                                                        User currentUser);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get all top up requests — admin dashboard
    List<TopUpRequestResponseDto.AdminView> getAllTopUpRequests();

    // Get all pending top up requests
    // admin sees newest requests first
    List<TopUpRequestResponseDto.AdminView> getPendingTopUpRequests();

    // Approve or reject a top up request
    // if approved → wallet credited automatically
    TopUpRequestResponseDto.ReviewResult reviewTopUpRequest(
            TopUpRequestDto.ReviewTopUpRequest dto,
            User admin);

    // Count pending top up requests
    // powers admin dashboard notification badge
    long countPendingRequests();
}