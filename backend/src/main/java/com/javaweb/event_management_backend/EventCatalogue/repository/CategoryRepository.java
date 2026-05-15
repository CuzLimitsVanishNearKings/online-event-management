package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by exact name
    Optional<Category> findByName(String name);

    // Check if category name already exists
    boolean existsByName(String name);

    // Search categories by name keyword
    List<Category> findByNameContainingIgnoreCase(String keyword);
}