package com.javaweb.event_management_backend.EventCatalogue.controllers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.CategoryRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.CategoryResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories
    // public — anyone can browse categories
    @GetMapping
    public ResponseEntity<List<CategoryResponseDto.Detail>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // GET /api/categories/{categoryId}
    // public — anyone can view a category
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponseDto.Detail> getCategoryById(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    // POST /api/categories
    // admin only — create a new category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDto.Detail> createCategory(
            @Valid @RequestBody CategoryRequestDto.CreateCategory dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(dto));
    }

    // PUT /api/categories/{categoryId}
    // admin only — update a category
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDto.Detail> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryRequestDto.UpdateCategory dto) {
        return ResponseEntity.ok(
                categoryService.updateCategory(categoryId, dto));
    }

    // DELETE /api/categories/{categoryId}
    // admin only — delete a category
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}