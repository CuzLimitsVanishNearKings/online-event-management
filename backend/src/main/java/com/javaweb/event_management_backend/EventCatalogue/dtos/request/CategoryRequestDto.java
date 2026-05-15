package com.javaweb.event_management_backend.EventCatalogue.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class CategoryRequestDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCategory {

        @NotBlank(message = "Category name is required")
        private String name;

        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateCategory {

        private String name;
        private String description;
    }
}