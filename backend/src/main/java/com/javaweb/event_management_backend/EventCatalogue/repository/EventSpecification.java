package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class EventSpecification {

    public static Specification<Event> filterEvents(String keyword, String category, String venue, LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Only published events
            predicates.add(cb.equal(root.get("status"), EventStatus.PUBLISHED));
            
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchExact = keyword.trim().toLowerCase();
                Predicate titleMatch = cb.equal(cb.lower(root.get("title")), searchExact);
                Predicate venueMatch = cb.equal(cb.lower(root.get("venue")), searchExact);
                predicates.add(cb.or(titleMatch, venueMatch));
            }
            
            if (category != null && !category.trim().isEmpty()) {
                predicates.add(cb.equal(root.join("category").get("name"), category.trim()));
            }
            
            if (venue != null && !venue.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("venue")), venue.trim().toLowerCase()));
            }
            
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDateTime"), startDate));
            }
            
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDateTime"), endDate));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
