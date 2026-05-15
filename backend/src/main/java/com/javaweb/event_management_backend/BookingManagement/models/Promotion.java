package com.javaweb.event_management_backend.BookingManagement.models;

import com.javaweb.event_management_backend.BookingManagement.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "promotion")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Promotion
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Long promotionId;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "usage_limit", nullable = false)
    private Integer usageLimit;

    @Column(name = "times_used", nullable = false)
    @Builder.Default
    private Integer timesUsed = 0;
}
