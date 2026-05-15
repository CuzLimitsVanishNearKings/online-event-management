package com.javaweb.event_management_backend.EventCatalogue.mappers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.CategoryRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.CategoryResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    // Entity → DTO
    public CategoryResponseDto.Summary toSummary(Category category) {
        return CategoryResponseDto.Summary.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .build();
    }

    public CategoryResponseDto.Detail toDetail(Category category) {
        return CategoryResponseDto.Detail.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    // DTO → Entity
    public Category toEntity(CategoryRequestDto.CreateCategory dto) {
        return Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    // Update existing entity from DTO
    // only update fields that are not null
    public void updateEntity(CategoryRequestDto.UpdateCategory dto, Category category) {
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            category.setDescription(dto.getDescription());
        }
    }
}