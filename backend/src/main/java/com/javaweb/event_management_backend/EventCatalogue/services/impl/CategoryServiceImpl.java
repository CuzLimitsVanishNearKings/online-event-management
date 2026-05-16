package com.javaweb.event_management_backend.EventCatalogue.services.impl;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.CategoryRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.CategoryResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.mappers.CategoryMapper;
import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import com.javaweb.event_management_backend.EventCatalogue.repository.CategoryRepository;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.CategoryService;
import com.javaweb.event_management_backend.exceptions.DuplicateResourceException;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponseDto.Detail> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDetail)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponseDto.Detail getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));
        return categoryMapper.toDetail(category);
    }

    @Override
    @Transactional
    public CategoryResponseDto.Detail createCategory(
            CategoryRequestDto.CreateCategory dto) {

        // check for duplicate name
        if (categoryRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException(
                    "Category already exists with name: " + dto.getName());
        }

        Category category = categoryMapper.toEntity(dto);
        categoryRepository.save(category);
        return categoryMapper.toDetail(category);
    }

    @Override
    @Transactional
    public CategoryResponseDto.Detail updateCategory(Long categoryId,
                                                     CategoryRequestDto.UpdateCategory dto) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));

        // check duplicate name only if name is being changed
        if (dto.getName() != null
                && !dto.getName().equals(category.getName())
                && categoryRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException(
                    "Category already exists with name: " + dto.getName());
        }

        categoryMapper.updateEntity(dto, category);
        categoryRepository.save(category);
        return categoryMapper.toDetail(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));
        categoryRepository.delete(category);
    }
}