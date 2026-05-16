package com.javaweb.event_management_backend.PaymentManagement.services.impl;

import com.javaweb.event_management_backend.PaymentManagement.dtos.request.TopUpRequestDto;
import com.javaweb.event_management_backend.PaymentManagement.dtos.response.TopUpRequestResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.enums.TopUpRequestStatus;
import com.javaweb.event_management_backend.PaymentManagement.mappers.TopUpRequestMapper;
import com.javaweb.event_management_backend.PaymentManagement.models.TopUpRequest;
import com.javaweb.event_management_backend.PaymentManagement.repository.TopUpRequestRepository;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.TopUpRequestService;
import com.javaweb.event_management_backend.PaymentManagement.services.interfaces.WalletService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopUpRequestServiceImpl implements TopUpRequestService {

    private final TopUpRequestRepository topUpRequestRepository;
    private final WalletService walletService;
    private final TopUpRequestMapper topUpRequestMapper;

    // ─── CLIENT ──────────────────────────────────────────────────

    @Override
    @Transactional
    public TopUpRequestResponseDto.Summary createTopUpRequest(
            TopUpRequestDto.CreateTopUpRequest dto, User currentUser) {

        // check if user already has a pending request
        List<TopUpRequest> pendingRequests = topUpRequestRepository
                .findByUserAndStatus(currentUser, TopUpRequestStatus.PENDING);

        if (!pendingRequests.isEmpty()) {
            throw new IllegalArgumentException(
                    "You already have a pending top up request. "
                            + "Please wait for it to be reviewed.");
        }

        TopUpRequest request = TopUpRequest.builder()
                .user(currentUser)
                .amount(dto.getAmount())
                .status(TopUpRequestStatus.PENDING)
                .build();

        topUpRequestRepository.save(request);
        return topUpRequestMapper.toSummary(request);
    }

    @Override
    public List<TopUpRequestResponseDto.Summary> getMyTopUpRequests(
            User currentUser) {
        return topUpRequestRepository.findByUser(currentUser)
                .stream()
                .map(topUpRequestMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public TopUpRequestResponseDto.Summary getTopUpRequestById(
            Long requestId, User currentUser) {

        TopUpRequest request = findRequestById(requestId);

        // user can only view their own requests
        if (!request.getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to view this request");
        }

        return topUpRequestMapper.toSummary(request);
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public List<TopUpRequestResponseDto.AdminView> getAllTopUpRequests() {
        return topUpRequestRepository.findAll()
                .stream()
                .map(topUpRequestMapper::toAdminView)
                .collect(Collectors.toList());
    }

    @Override
    public List<TopUpRequestResponseDto.AdminView> getPendingTopUpRequests() {
        return topUpRequestRepository
                .findByStatusOrderByCreatedAtDesc(TopUpRequestStatus.PENDING)
                .stream()
                .map(topUpRequestMapper::toAdminView)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TopUpRequestResponseDto.ReviewResult reviewTopUpRequest(
            TopUpRequestDto.ReviewTopUpRequest dto, User admin) {

        TopUpRequest request = findRequestById(dto.getRequestId());

        // can only review PENDING requests
        if (request.getStatus() != TopUpRequestStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only PENDING requests can be reviewed. "
                            + "This request is already "
                            + request.getStatus());
        }

        // set review details
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());
        request.setAdminNote(dto.getAdminNote());

        String message;

        if (dto.getApproved()) {
            // approve — credit wallet
            request.setStatus(TopUpRequestStatus.APPROVED);

            walletService.creditBalance(
                    request.getUser(),
                    request.getAmount(),
                    "Wallet top up approved — "
                            + request.getAmount() + " XAF");

            message = "Top up request approved. "
                    + request.getAmount()
                    + " XAF credited to "
                    + request.getUser().getFirstName()
                    + "'s wallet.";
        } else {
            // reject — no wallet change
            request.setStatus(TopUpRequestStatus.REJECTED);
            message = "Top up request rejected for "
                    + request.getUser().getFirstName()
                    + " "
                    + request.getUser().getLastName();
        }

        topUpRequestRepository.save(request);
        return topUpRequestMapper.toReviewResult(request, message);
    }

    @Override
    public long countPendingRequests() {
        return topUpRequestRepository
                .countByStatus(TopUpRequestStatus.PENDING);
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private TopUpRequest findRequestById(Long requestId) {
        return topUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Top up request not found with id: " + requestId));
    }
}