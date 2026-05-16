package com.javaweb.event_management_backend.BookingManagement.controllers;

import com.javaweb.event_management_backend.BookingManagement.dtos.request.PromotionRequestDto;
import com.javaweb.event_management_backend.BookingManagement.dtos.response.PromotionResponseDto;
import com.javaweb.event_management_backend.BookingManagement.services.interfaces.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    // ─── PUBLIC ──────────────────────────────────────────────────

    // POST /api/promotions/validate
    // validate a promo code at checkout
    @PostMapping("/validate")
    public ResponseEntity<PromotionResponseDto.ValidationResult> validateCode(
            @Valid @RequestBody PromotionRequestDto.ValidateCode dto) {
        return ResponseEntity.ok(promotionService.validateCode(dto));
    }

    // ─── ADMIN ───────────────────────────────────────────────────

    // GET /api/promotions
    // get all promotions
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromotionResponseDto.Summary>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    // GET /api/promotions/active
    // get all active promotions
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromotionResponseDto.Summary>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.getActivePromotions());
    }

    // GET /api/promotions/{promotionId}
    // get promotion by id
    @GetMapping("/{promotionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponseDto.Summary> getPromotionById(
            @PathVariable Long promotionId) {
        return ResponseEntity.ok(
                promotionService.getPromotionById(promotionId));
    }

    // POST /api/promotions
    // create a new promotion
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponseDto.Summary> createPromotion(
            @Valid @RequestBody PromotionRequestDto.CreatePromotion dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(promotionService.createPromotion(dto));
    }

    // PUT /api/promotions/{promotionId}
    // update a promotion
    @PutMapping("/{promotionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponseDto.Summary> updatePromotion(
            @PathVariable Long promotionId,
            @Valid @RequestBody PromotionRequestDto.UpdatePromotion dto) {
        return ResponseEntity.ok(
                promotionService.updatePromotion(promotionId, dto));
    }

    // DELETE /api/promotions/{promotionId}
    // delete a promotion
    @DeleteMapping("/{promotionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePromotion(
            @PathVariable Long promotionId) {
        promotionService.deletePromotion(promotionId);
        return ResponseEntity.noContent().build();
    }
}