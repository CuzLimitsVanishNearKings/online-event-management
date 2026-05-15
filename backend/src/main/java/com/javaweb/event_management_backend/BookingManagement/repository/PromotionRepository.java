package com.javaweb.event_management_backend.BookingManagement.repository;

import com.javaweb.event_management_backend.BookingManagement.models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Find a promotion by its code — used at checkout
    Optional<Promotion> findByCode(String code);

    // Check if a promotion code already exists
    boolean existsByCode(String code);

    // Find all promotions that are currently valid
    // end date is after today AND start date is before today
    List<Promotion> findByStartDateBeforeAndEndDateAfter(LocalDate start, LocalDate end);

    // Find all promotions that have not exceeded their usage limit
    List<Promotion> findByTimesUsedLessThan(int usageLimit);

    // Find promotions expiring before a given date
    // useful for admin to clean up expired promotions
    List<Promotion> findByEndDateBefore(LocalDate date);

    // Check if a promotion is still usable
    // valid date range AND usage limit not exceeded
    boolean existsByCodeAndEndDateAfterAndTimesUsedLessThan(
            String code,
            LocalDate date,
            int usageLimit
    );
}