package com.javaweb.event_management_backend.seed;

import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TicketTypeSeeder {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;

    public void seed() {

        // fetch events
        Event techConference = eventRepository
                .findByTitleContainingIgnoreCase("Cameroon Tech Summit")
                .get(0);
        Event hackathon = eventRepository
                .findByTitleContainingIgnoreCase("Hack Yaoundé")
                .get(0);
        Event festivalCulture = eventRepository
                .findByTitleContainingIgnoreCase("Festival des Arts")
                .get(0);
        Event musicNight = eventRepository
                .findByTitleContainingIgnoreCase("Makossa Night")
                .get(0);
        Event businessForum = eventRepository
                .findByTitleContainingIgnoreCase("Cameroon Business Forum")
                .get(0);

        // ─── TECH CONFERENCE TICKETS ─────────────────────────────

        ticketTypeRepository.saveAll(List.of(
                TicketType.builder()
                        .name("Early Bird")
                        .price(new BigDecimal("5000.00"))
                        .quantity(100)
                        .event(techConference)
                        .build(),
                TicketType.builder()
                        .name("Regular")
                        .price(new BigDecimal("10000.00"))
                        .quantity(300)
                        .event(techConference)
                        .build(),
                TicketType.builder()
                        .name("VIP")
                        .price(new BigDecimal("25000.00"))
                        .quantity(100)
                        .event(techConference)
                        .build()
        ));

        // ─── HACKATHON TICKETS ───────────────────────────────────

        ticketTypeRepository.saveAll(List.of(
                TicketType.builder()
                        .name("Individual")
                        .price(new BigDecimal("2000.00"))
                        .quantity(150)
                        .event(hackathon)
                        .build(),
                TicketType.builder()
                        .name("Team (5 members)")
                        .price(new BigDecimal("8000.00"))
                        .quantity(50)
                        .event(hackathon)
                        .build()
        ));

        // ─── FESTIVAL TICKETS ────────────────────────────────────

        ticketTypeRepository.saveAll(List.of(
                TicketType.builder()
                        .name("General Admission")
                        .price(new BigDecimal("0.00"))
                        .quantity(800)
                        .event(festivalCulture)
                        .build(),
                TicketType.builder()
                        .name("VIP Lounge")
                        .price(new BigDecimal("15000.00"))
                        .quantity(200)
                        .event(festivalCulture)
                        .build()
        ));

        // ─── MUSIC NIGHT TICKETS ─────────────────────────────────

        ticketTypeRepository.saveAll(List.of(
                TicketType.builder()
                        .name("Standard")
                        .price(new BigDecimal("5000.00"))
                        .quantity(200)
                        .event(musicNight)
                        .build(),
                TicketType.builder()
                        .name("Front Row VIP")
                        .price(new BigDecimal("20000.00"))
                        .quantity(100)
                        .event(musicNight)
                        .build()
        ));

        // ─── BUSINESS FORUM TICKETS ──────────────────────────────

        ticketTypeRepository.saveAll(List.of(
                TicketType.builder()
                        .name("Delegate")
                        .price(new BigDecimal("15000.00"))
                        .quantity(300)
                        .event(businessForum)
                        .build(),
                TicketType.builder()
                        .name("Speaker")
                        .price(new BigDecimal("0.00"))
                        .quantity(50)
                        .event(businessForum)
                        .build(),
                TicketType.builder()
                        .name("Sponsor")
                        .price(new BigDecimal("100000.00"))
                        .quantity(50)
                        .event(businessForum)
                        .build()
        ));

        System.out.println("✅ TicketTypeSeeder — seeded successfully");
    }
}