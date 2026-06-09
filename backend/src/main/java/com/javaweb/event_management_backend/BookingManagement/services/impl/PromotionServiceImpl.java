package com.javaweb.event_management_backend.BookingManagement.services.impl;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PromotionRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PromotionResponseDto;
import com.javaweb.event_management_backend.BookingManagement.enums.DiscountType;
import com.javaweb.event_management_backend.BookingManagement.mappers.PromotionMapper;
import com.javaweb.event_management_backend.BookingManagement.models.Promotion;
import com.javaweb.event_management_backend.BookingManagement.repository.PromotionRepository;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.PromotionService;
import com.javaweb.event_management_backend.exceptions.DuplicateResourceException;
import com.javaweb.event_management_backend.exceptions.InvalidPromotionException;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    // ─── PUBLIC ──────────────────────────────────────────────────

    @Override
    public PromotionResponseDto.ValidationResult validateCode(
            PromotionRequestDto.ValidateCode dto) {

        Promotion promotion = promotionRepository
                .findByCode(dto.getCode().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion not found with code: " + dto.getCode()));

        boolean isValid = isPromotionValid(promotion);
        return promotionMapper.toValidationResult(promotion, isValid);
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    @Override
    public List<PromotionResponseDto.Summary> getAllPromotions() {
        return promotionRepository.findAll()
                .stream()
                .map(promotionMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<PromotionResponseDto.Summary> getActivePromotions() {
        LocalDate today = LocalDate.now();
        return promotionRepository
                .findByStartDateBeforeAndEndDateAfter(today, today)
                .stream()
                .filter(p -> p.getTimesUsed() < p.getUsageLimit())
                .map(promotionMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public PromotionResponseDto.Summary getPromotionById(Long promotionId) {
        Promotion promotion = findPromotionById(promotionId);
        return promotionMapper.toSummary(promotion);
    }

    @Override
    @Transactional
    public PromotionResponseDto.Summary createPromotion(
            PromotionRequestDto.CreatePromotion dto) {

        // check for duplicate code
        if (promotionRepository.existsByCode(dto.getCode().toUpperCase())) {
            throw new DuplicateResourceException(
                    "Promotion already exists with code: " + dto.getCode());
        }

        // end date must be after start date
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date must be after start date");
        }

        // percentage discount cannot exceed 100%
        if (dto.getDiscountType() == DiscountType.PERCENTAGE
                && dto.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException(
                    "Percentage discount cannot exceed 100%");
        }

        Promotion promotion = promotionMapper.toEntity(dto);
        promotionRepository.save(promotion);
        return promotionMapper.toSummary(promotion);
    }

    @Override
    @Transactional
    public PromotionResponseDto.Summary updatePromotion(Long promotionId,
                                                        PromotionRequestDto.UpdatePromotion dto) {

        Promotion promotion = findPromotionById(promotionId);

        // validate percentage discount
        if (dto.getDiscountType() == DiscountType.PERCENTAGE
                && dto.getDiscountValue() != null
                && dto.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException(
                    "Percentage discount cannot exceed 100%");
        }

        // validate dates if both provided
        if (dto.getStartDate() != null && dto.getEndDate() != null
                && dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date must be after start date");
        }

        promotionMapper.updateEntity(dto, promotion);
        promotionRepository.save(promotion);
        return promotionMapper.toSummary(promotion);
    }

    @Override
    @Transactional
    public void deletePromotion(Long promotionId) {
        Promotion promotion = findPromotionById(promotionId);
        promotionRepository.delete(promotion);
    }

    // ─── INTERNAL ────────────────────────────────────────────────

    @Override
    @Transactional
    public BigDecimal applyPromotion(String code, BigDecimal originalAmount) {

        Promotion promotion = promotionRepository
                .findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion not found with code: " + code));

        // validate promotion
        if (!isPromotionValid(promotion)) {
            throw new InvalidPromotionException(
                    "Promotion code is not valid: " + code);
        }

        // calculate discount amount
        BigDecimal discountAmount;

        if (promotion.getDiscountType() == DiscountType.PERCENTAGE) {
            // e.g 20% of 15,000 XAF = 3,000 XAF
            discountAmount = originalAmount
                    .multiply(promotion.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            // fixed amount discount
            // discount cannot exceed original amount
            discountAmount = promotion.getDiscountValue()
                    .min(originalAmount);
        }

        // increment times used
        promotion.setTimesUsed(promotion.getTimesUsed() + 1);
        promotionRepository.save(promotion);

        return discountAmount;
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Promotion findPromotionById(Long promotionId) {
        return promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion not found with id: " + promotionId));
    }

    // check all three validity conditions
    private boolean isPromotionValid(Promotion promotion)
    {
        LocalDate today = LocalDate.now();
        return (promotion.getStartDate().isEqual(today)
                || promotion.getStartDate().isBefore(today))
                && promotion.getEndDate().isAfter(today)
                && promotion.getTimesUsed() < promotion.getUsageLimit();
    }
}