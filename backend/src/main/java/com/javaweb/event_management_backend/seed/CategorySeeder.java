package com.javaweb.event_management_backend.seed;

import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import com.javaweb.event_management_backend.EventCatalogue.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategorySeeder {

    private final CategoryRepository categoryRepository;

    public void seed() {
        List<Category> categories = List.of(
                Category.builder()
                        .name("Technology")
                        .description("Tech conferences, hackathons and workshops")
                        .build(),
                Category.builder()
                        .name("Music")
                        .description("Concerts, festivals and music shows")
                        .build(),
                Category.builder()
                        .name("Sports")
                        .description("Sports events, tournaments and competitions")
                        .build(),
                Category.builder()
                        .name("Culture")
                        .description("Cultural events, exhibitions and festivals")
                        .build(),
                Category.builder()
                        .name("Business")
                        .description("Business conferences, networking and seminars")
                        .build(),
                Category.builder()
                        .name("Art")
                        .description("Art exhibitions, shows and workshops")
                        .build(),
                Category.builder()
                        .name("Food")
                        .description("Food festivals, tastings and culinary events")
                        .build(),
                Category.builder()
                        .name("Education")
                        .description("Educational workshops, seminars and trainings")
                        .build()
        );

        categoryRepository.saveAll(categories);
        System.out.println("✅ CategorySeeder — seeded successfully");
    }
}