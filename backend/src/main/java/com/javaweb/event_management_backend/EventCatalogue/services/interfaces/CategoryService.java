package com.javaweb.event_management_backend.EventCatalogue.services.interfaces;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.CategoryRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    // Get all categories — public
    List<CategoryResponseDto.Detail> getAllCategories();

    // Get category by id — public
    CategoryResponseDto.Detail getCategoryById(Long categoryId);

    // Create a new category — admin only
    CategoryResponseDto.Detail createCategory(CategoryRequestDto.CreateCategory dto);

    // Update a category — admin only
    CategoryResponseDto.Detail updateCategory(Long categoryId,
                                              CategoryRequestDto.UpdateCategory dto);

    // Delete a category — admin only
    void deleteCategory(Long categoryId);
}