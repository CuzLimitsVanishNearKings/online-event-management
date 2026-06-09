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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // ─── PUBLIC ENDPOINTS ───────────────────────────
                        .requestMatchers("/api/auth/**").permitAll()

                        // Anyone can browse events
                        .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/promotions/validate").permitAll()

                        // Swagger UI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // ─── ADMIN ONLY ──────────────────────────────────
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ─── ORGANIZER ONLY ──────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/events/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ORGANIZER")
                        .requestMatchers("/api/events/*/ticket-types/**").hasRole("ORGANIZER")
                        .requestMatchers("/api/tickets/verify/**").hasRole("ORGANIZER")
                        .requestMatchers("/api/organizer/**").hasRole("ORGANIZER")

                        // ─── CLIENT + ORGANIZER ──────────────────────────
                        .requestMatchers("/api/bookings/**").hasAnyRole("CLIENT", "ORGANIZER")
                        .requestMatchers("/api/wallet/**").hasAnyRole("CLIENT", "ORGANIZER")
                        .requestMatchers("/api/payments/**").hasAnyRole("CLIENT", "ORGANIZER")
                        .requestMatchers("/api/top-up-requests/**").hasAnyRole("CLIENT", "ORGANIZER", "ADMIN")
                        .requestMatchers("/api/planning/**").hasAnyRole("CLIENT", "ORGANIZER")

                        // ─── ANY AUTHENTICATED USER ──────────────────────
                        .anyRequest().authenticated()
                )

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authenticationProvider(authenticationProvider())
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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}