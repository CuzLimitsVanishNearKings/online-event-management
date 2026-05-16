package com.javaweb.event_management_backend.seed;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Category;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.repository.CategoryRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.UserManagement.repository.OrganizerRepository;
import com.javaweb.event_management_backend.UserManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class EventSeeder {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;

    public void seed() {

        // fetch organizers
        OrganizerProfile organizer1 = organizerRepository
                .findByUser(userRepository.findByEmail("alice@techevents.cm")
                        .orElseThrow()).orElseThrow();

        OrganizerProfile organizer2 = organizerRepository
                .findByUser(userRepository.findByEmail("bruno@culturecm.cm")
                        .orElseThrow()).orElseThrow();

        // fetch categories
        Category techCategory = categoryRepository
                .findByName("Technology").orElseThrow();
        Category musicCategory = categoryRepository
                .findByName("Music").orElseThrow();
        Category cultureCategory = categoryRepository
                .findByName("Culture").orElseThrow();
        Category businessCategory = categoryRepository
                .findByName("Business").orElseThrow();

        // ─── TECH EVENTS ─────────────────────────────────────────

        Event techConference = Event.builder()
                .title("Cameroon Tech Summit 2025")
                .description("The biggest technology conference in Central Africa. "
                        + "Join us for 2 days of talks, workshops and networking "
                        + "with the best tech minds in the region.")
                .venue("Palais des Congrès, Yaoundé")
                .startDateTime(LocalDateTime.of(2025, 8, 15, 9, 0))
                .endDateTime(LocalDateTime.of(2025, 8, 16, 18, 0))
                .capacity(500)
                .status(EventStatus.PUBLISHED)
                .coverImage("https://via.placeholder.com/800x400")
                .category(techCategory)
                .organizer(organizer1)
                .build();
        eventRepository.save(techConference);

        Event hackathon = Event.builder()
                .title("Hack Yaoundé 2025")
                .description("48-hour hackathon for developers, designers "
                        + "and entrepreneurs to build innovative solutions "
                        + "for African challenges.")
                .venue("ActivSpaces, Yaoundé")
                .startDateTime(LocalDateTime.of(2025, 9, 5, 8, 0))
                .endDateTime(LocalDateTime.of(2025, 9, 7, 20, 0))
                .capacity(200)
                .status(EventStatus.PUBLISHED)
                .coverImage("https://via.placeholder.com/800x400")
                .category(techCategory)
                .organizer(organizer1)
                .build();
        eventRepository.save(hackathon);

        // draft event — not yet published
        Event webinarDraft = Event.builder()
                .title("AI & Machine Learning Workshop")
                .description("Hands-on workshop on artificial intelligence "
                        + "and machine learning fundamentals.")
                .venue("Online — Zoom")
                .startDateTime(LocalDateTime.of(2025, 10, 1, 10, 0))
                .endDateTime(LocalDateTime.of(2025, 10, 1, 16, 0))
                .capacity(100)
                .status(EventStatus.DRAFT)
                .coverImage("https://via.placeholder.com/800x400")
                .category(techCategory)
                .organizer(organizer1)
                .build();
        eventRepository.save(webinarDraft);

        // ─── CULTURE EVENTS ──────────────────────────────────────

        Event festivalCulture = Event.builder()
                .title("Festival des Arts de Douala 2025")
                .description("Annual celebration of Cameroonian arts and culture. "
                        + "Music, dance, food and art exhibitions from all regions.")
                .venue("Esplanade de la Préfecture, Douala")
                .startDateTime(LocalDateTime.of(2025, 7, 20, 10, 0))
                .endDateTime(LocalDateTime.of(2025, 7, 22, 22, 0))
                .capacity(1000)
                .status(EventStatus.PUBLISHED)
                .coverImage("https://via.placeholder.com/800x400")
                .category(cultureCategory)
                .organizer(organizer2)
                .build();
        eventRepository.save(festivalCulture);

        Event musicNight = Event.builder()
                .title("Makossa Night Live")
                .description("An unforgettable evening of live Makossa music "
                        + "featuring the best artists from Cameroon and beyond.")
                .venue("Salle des Fêtes, Douala")
                .startDateTime(LocalDateTime.of(2025, 8, 30, 19, 0))
                .endDateTime(LocalDateTime.of(2025, 8, 30, 23, 59))
                .capacity(300)
                .status(EventStatus.PUBLISHED)
                .coverImage("https://via.placeholder.com/800x400")
                .category(musicCategory)
                .organizer(organizer2)
                .build();
        eventRepository.save(musicNight);

        // ─── BUSINESS EVENTS ─────────────────────────────────────

        Event businessForum = Event.builder()
                .title("Cameroon Business Forum 2025")
                .description("Annual forum bringing together entrepreneurs, "
                        + "investors and business leaders to discuss "
                        + "opportunities in Cameroon.")
                .venue("Hilton Hotel, Yaoundé")
                .startDateTime(LocalDateTime.of(2025, 11, 10, 8, 0))
                .endDateTime(LocalDateTime.of(2025, 11, 11, 17, 0))
                .capacity(400)
                .status(EventStatus.PUBLISHED)
                .coverImage("https://via.placeholder.com/800x400")
                .category(businessCategory)
                .organizer(organizer1)
                .build();
        eventRepository.save(businessForum);

        System.out.println("✅ EventSeeder — seeded successfully");
    }
}