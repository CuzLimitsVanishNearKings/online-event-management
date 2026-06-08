package com.javaweb.event_management_backend.PaymentManagement.repository;

import com.javaweb.event_management_backend.PaymentManagement.enums.TopUpRequestStatus;
import com.javaweb.event_management_backend.PaymentManagement.models.TopUpRequest;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TopUpRequestRepository extends JpaRepository<TopUpRequest, Long> {

    // Find all top up requests by a user
    List<TopUpRequest> findByUser(User user);

    // Find all top up requests by status
    // admin uses this to see all PENDING requests
    List<TopUpRequest> findByStatus(TopUpRequestStatus status);

    // Find all top up requests by user and status
    // e.g "show me all PENDING requests for this user"
    List<TopUpRequest> findByUserAndStatus(User user, TopUpRequestStatus status);

    // Find all requests ordered by most recent first
    // admin dashboard shows newest requests first
    Page<TopUpRequest> findByStatusOrderByCreatedAtDesc(TopUpRequestStatus status, Pageable pageable);

    // Find all requests reviewed by a specific admin
    List<TopUpRequest> findByReviewedBy(User admin);

    // Find all requests made between two dates
    List<TopUpRequest> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);



    Page<TopUpRequest> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);



    Page<TopUpRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Count total pending requests
    // powers the admin dashboard notification badge
    long countByStatus(TopUpRequestStatus status);
}