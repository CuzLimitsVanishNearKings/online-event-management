package com.javaweb.event_management_backend.seed;

import com.javaweb.event_management_backend.BookingManagement.enums.DiscountType;
import com.javaweb.event_management_backend.BookingManagement.models.Promotion;
import com.javaweb.event_management_backend.BookingManagement.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PromotionSeeder {

    private final PromotionRepository promotionRepository;

    public void seed() {
        List<Promotion> promotions = List.of(
                Promotion.builder()
                        .code("SAVE20")
                        .discountValue(new BigDecimal("20"))
                        .discountType(DiscountType.PERCENTAGE)
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusMonths(3))
                        .usageLimit(100)
                        .timesUsed(0)
                        .build(),
                Promotion.builder()
                        .code("WELCOME5000")
                        .discountValue(new BigDecimal("5000"))
                        .discountType(DiscountType.FIXED)
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusMonths(1))
                        .usageLimit(50)
                        .timesUsed(0)
                        .build(),
                Promotion.builder()
                        .code("STUDENT10")
                        .discountValue(new BigDecimal("10"))
                        .discountType(DiscountType.PERCENTAGE)
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusMonths(6))
                        .usageLimit(200)
                        .timesUsed(0)
                        .build(),
                Promotion.builder()
                        .code("EARLYBIRD")
                        .discountValue(new BigDecimal("15"))
                        .discountType(DiscountType.PERCENTAGE)
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusWeeks(2))
                        .usageLimit(30)
                        .timesUsed(0)
                        .build()
        );

        promotionRepository.saveAll(promotions);
        System.out.println("✅ PromotionSeeder — seeded successfully");
    }
}