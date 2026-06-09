package com.javaweb.event_management_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // We're doing a barebones fixed-window approach here. 
    // Not as smooth as a token bucket, but it absolutely does the job
    // for preventing basic script kiddie brute forces on our auth endpoints.
    // Maps the user's IP to an array containing [requests_in_this_window, window_start_timestamp_ms]
    private final Map<String, long[]> requestCounts = new ConcurrentHashMap<>();
    
    // Setting a hard limit of 30 req/min. If a legitimate user is hitting login 
    // more than 30 times a minute, they need a coffee break anyway.
    private static final int MAX_REQUESTS_PER_MINUTE = 30;
    private static final long WINDOW_TIME_MS = 60000;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only rate limit auth and booking checkout endpoints to prevent abuse
        if (path.startsWith("/api/auth/") || path.startsWith("/api/bookings")) {
            String clientIp = getClientIP(request);
            long currentTime = System.currentTimeMillis();

            long[] clientStats = requestCounts.compute(clientIp, (key, stats) -> {
                if (stats == null || currentTime - stats[1] > WINDOW_TIME_MS) {
                    // Start new window
                    return new long[]{1, currentTime};
                } else {
                    // Increment count in current window
                    stats[0]++;
                    return stats;
                }
            });

            if (clientStats[0] > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests. Please try again later.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
