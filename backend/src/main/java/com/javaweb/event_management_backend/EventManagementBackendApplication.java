package com.javaweb.event_management_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class EventManagementBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventManagementBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner forceAlterTable(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE event MODIFY cover_image LONGTEXT");
                System.out.println("SUCCESSFULLY ALTERED cover_image COLUMN TO LONGTEXT");
            } catch (Exception e) {
                System.out.println("ALTER TABLE skipped or failed: " + e.getMessage());
            }
        };
    }
}
