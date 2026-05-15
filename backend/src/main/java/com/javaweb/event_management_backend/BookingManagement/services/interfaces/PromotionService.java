package com.javaweb.event_management_backend.BookingManagement.services.interfaces;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PromotionRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PromotionResponseDto;

import java.util.List;

public interface PromotionService {

    // ─── PUBLIC ──────────────────────────────────────────────────

    // Validate a promo code at checkout
    // returns discount details if valid
    PromotionResponseDto.ValidationResult validateCode(
            PromotionRequestDto.ValidateCode dto);

    // ─── ADMIN ───────────────────────────────────────────────────

    // Get all promotions — admin dashboard
    List<PromotionResponseDto.Summary> getAllPromotions();

    // Get all active promotions
    List<PromotionResponseDto.Summary> getActivePromotions();

    // Get promotion by id
    PromotionResponseDto.Summary getPromotionById(Long promotionId);

    // Create a new promotion
    PromotionResponseDto.Summary createPromotion(
            PromotionRequestDto.CreatePromotion dto);

    // Update an existing promotion
    PromotionResponseDto.Summary updatePromotion(Long promotionId,
                                                 PromotionRequestDto.UpdatePromotion dto);

    // Delete a promotion
    void deletePromotion(Long promotionId);

    // ─── INTERNAL ────────────────────────────────────────────────

    // Apply a promo code to a booking
    // called internally by BookingService
    // returns discount amount to deduct
    java.math.BigDecimal applyPromotion(String code,
                                        java.math.BigDecimal originalAmount);
}