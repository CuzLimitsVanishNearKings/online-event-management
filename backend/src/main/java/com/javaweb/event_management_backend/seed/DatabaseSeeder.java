package com.javaweb.event_management_backend.seed;

import com.javaweb.event_management_backend.UserManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserSeeder userSeeder;
    private final CategorySeeder categorySeeder;
    private final EventSeeder eventSeeder;
    private final TicketTypeSeeder ticketTypeSeeder;
    private final PromotionSeeder promotionSeeder;

    @Override
    public void run(String... args) throws Exception {

        // only seed if database is empty
        if (userRepository.count() > 0) {
            System.out.println("⏭️ Database already seeded — skipping");
            return;
        }

        System.out.println("🌱 Starting database seeding...");

        // order matters — respect foreign key dependencies
        userSeeder.seed();
        categorySeeder.seed();
        eventSeeder.seed();
        ticketTypeSeeder.seed();
        promotionSeeder.seed();

        System.out.println("🎉 Database seeding complete!");
        System.out.println("─────────────────────────────");
        System.out.println("Test accounts:");
        System.out.println("ADMIN     → admin@eventify.cm     / Admin@1234");
        System.out.println("ORGANIZER → alice@techevents.cm   / Organizer@1234");
        System.out.println("ORGANIZER → bruno@culturecm.cm    / Organizer@1234");
        System.out.println("CLIENT    → jean@gmail.com         / Client@1234");
        System.out.println("CLIENT    → marie@gmail.com        / Client@1234");
        System.out.println("─────────────────────────────");
    }
}