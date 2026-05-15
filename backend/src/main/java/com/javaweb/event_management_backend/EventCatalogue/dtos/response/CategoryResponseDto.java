package com.javaweb.event_management_backend.EventCatalogue.dtos.response;

import lombok.*;

public class CategoryResponseDto {

    // Used in simple listings and dropdowns
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long categoryId;
        private String name;
    }

    // Used when viewing full category details
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Detail {
        private Long categoryId;
        private String name;
        private String description;
    }
}