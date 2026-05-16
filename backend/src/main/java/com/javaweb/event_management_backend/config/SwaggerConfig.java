package com.javaweb.event_management_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                // ─── API INFO ────────────────────────────────────
                .info(new Info()
                        .title("Online Event Management System API")
                        .description("REST API for the Online Event Management " +
                                "and Ticketing System — ISI3196 Java Web Programming")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Institut Saint Jean")
                                .email("info@institutsaintjean.org")))

                // ─── JWT SECURITY SCHEME ─────────────────────────
                // tells Swagger to add Authorization header
                // with Bearer token to every request
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Paste your JWT token here. " +
                                                "Get it from /api/auth/login")));
    }
}