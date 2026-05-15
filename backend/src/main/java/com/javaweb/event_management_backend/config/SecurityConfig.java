package com.javaweb.event_management_backend.config;

import com.javaweb.event_management_backend.UserManagement.security.JwtAuthFilter;
import com.javaweb.event_management_backend.UserManagement.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // ─── PUBLIC ENDPOINTS ───────────────────────────
                        .requestMatchers("/api/auth/**").permitAll()

                        // Anyone can browse events
                        .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                        // Swagger UI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**"
                        ).permitAll()

                        // ─── ADMIN ONLY ──────────────────────────────────
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ─── ORGANIZER ONLY ──────────────────────────────
                        // event management
                        .requestMatchers(HttpMethod.POST, "/api/events/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ORGANIZER")

                        // ticket type management
                        .requestMatchers("/api/events/*/ticket-types/**").hasRole("ORGANIZER")

                        // ticket verification at the door
                        .requestMatchers("/api/tickets/verify/**").hasRole("ORGANIZER")

                        // organizer dashboard
                        .requestMatchers("/api/organizer/**").hasRole("ORGANIZER")

                        // ─── ATTENDEE ONLY ───────────────────────────────
                        .requestMatchers("/api/bookings/**").hasRole("CLIENT")
                        .requestMatchers("/api/wallet/**").hasRole("CLIENT")
                        .requestMatchers("/api/payments/**").hasRole("CLIENT")

                        // ─── ANY AUTHENTICATED USER ──────────────────────
                        .anyRequest().authenticated()
                )

                // Stateless — no sessions, JWT handles everything
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Register our custom auth provider
                .authenticationProvider(authenticationProvider())

                // Register JWT filter before Spring's default login filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}