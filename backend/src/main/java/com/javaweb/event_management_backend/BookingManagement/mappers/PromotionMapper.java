package com.javaweb.event_management_backend.BookingManagement.mappers;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PromotionRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PromotionResponseDto;
import com.javaweb.event_management_backend.BookingManagement.models.Promotion;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PromotionMapper {

    // Entity → DTO
    public PromotionResponseDto.Summary toSummary(Promotion promotion) {

        // compute isActive — valid date range AND usage limit not exceeded
        boolean isActive = promotion.getEndDate().isAfter(LocalDate.now())
                && promotion.getStartDate().isBefore(LocalDate.now())
                && promotion.getTimesUsed() < promotion.getUsageLimit();

        return PromotionResponseDto.Summary.builder()
                .promotionId(promotion.getPromotionId())
                .code(promotion.getCode())
                .discountValue(promotion.getDiscountValue())
                .discountType(promotion.getDiscountType())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .usageLimit(promotion.getUsageLimit())
                .timesUsed(promotion.getTimesUsed())
                .isActive(isActive)
                .build();
    }

    public PromotionResponseDto.ValidationResult toValidationResult(
            Promotion promotion, boolean isValid) {

        String message = isValid
                ? "Code \"" + promotion.getCode() + "\" applied successfully"
                : "Code \"" + promotion.getCode() + "\" is not valid";

        return PromotionResponseDto.ValidationResult.builder()
                .code(promotion.getCode())
                .discountValue(promotion.getDiscountValue())
                .discountType(promotion.getDiscountType())
                .isValid(isValid)
                .message(message)
                .build();
    }

    // DTO → Entity
    public Promotion toEntity(PromotionRequestDto.CreatePromotion dto) {
        return Promotion.builder()
                .code(dto.getCode().toUpperCase())
                .discountValue(dto.getDiscountValue())
                .discountType(dto.getDiscountType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .usageLimit(dto.getUsageLimit())
                .build();
    }

    // Update existing entity from DTO
    public void updateEntity(PromotionRequestDto.UpdatePromotion dto, Promotion promotion) {
        if (dto.getDiscountValue() != null) {
            promotion.setDiscountValue(dto.getDiscountValue());
        }
        if (dto.getDiscountType() != null) {
            promotion.setDiscountType(dto.getDiscountType());
        }
        if (dto.getStartDate() != null) {
            promotion.setStartDate(dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            promotion.setEndDate(dto.getEndDate());
        }
        if (dto.getUsageLimit() != null) {
            promotion.setUsageLimit(dto.getUsageLimit());
        }
    }
}