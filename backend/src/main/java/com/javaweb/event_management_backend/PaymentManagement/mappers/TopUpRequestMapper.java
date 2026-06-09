package com.javaweb.event_management_backend.PaymentManagement.mappers;

import com.javaweb.event_management_backend.PaymentManagement.dtos.response.TopUpRequestResponseDto;
import com.javaweb.event_management_backend.PaymentManagement.models.TopUpRequest;
import org.springframework.stereotype.Component;

@Component
public class TopUpRequestMapper {

    // Entity → DTO
    public TopUpRequestResponseDto.Summary toSummary(TopUpRequest request) {
        return TopUpRequestResponseDto.Summary.builder()
                .requestId(request.getRequestId())
                .amount(request.getAmount())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .reviewedAt(request.getReviewedAt())
                .adminNote(request.getAdminNote())
                .build();
    }

    public TopUpRequestResponseDto.AdminView toAdminView(TopUpRequest request) {

        // get reviewer name if request has been reviewed
        String reviewedByName = request.getReviewedBy() != null
                ? request.getReviewedBy().getFirstName()
                + " " + request.getReviewedBy().getLastName()
                : null;

        return TopUpRequestResponseDto.AdminView.builder()
                .requestId(request.getRequestId())
                .amount(request.getAmount())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .reviewedAt(request.getReviewedAt())
                .requesterName(request.getUser().getFirstName()
                        + " " + request.getUser().getLastName())
                .requesterEmail(request.getUser().getEmail())
                .reviewedByName(reviewedByName)
                .adminNote(request.getAdminNote())
                .build();
    }

    public TopUpRequestResponseDto.ReviewResult toReviewResult(
            TopUpRequest request, String message) {
        return TopUpRequestResponseDto.ReviewResult.builder()
                .requestId(request.getRequestId())
                .status(request.getStatus())
                .amount(request.getAmount())
                .requesterName(request.getUser().getFirstName()
                        + " " + request.getUser().getLastName())
                .adminNote(request.getAdminNote())
                .message(message)
                .build();
    }

    // No toEntity here — TopUpRequests are created
    // directly in the service layer
}