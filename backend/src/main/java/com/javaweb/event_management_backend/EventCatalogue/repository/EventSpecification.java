package com.javaweb.event_management_backend.EventCatalogue.repository;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class EventSpecification {

    public static Specification<Event> filterEvents(String keyword, String category, String venue, LocalDateTime startDate, LocalDateTime endDate, BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Only published events
            predicates.add(cb.equal(root.get("status"), EventStatus.PUBLISHED));
            
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchExact = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchExact);
                Predicate venueMatch = cb.like(cb.lower(root.get("venue")), searchExact);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchExact);
                predicates.add(cb.or(titleMatch, venueMatch, descMatch));
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

            if (minPrice != null || maxPrice != null) {
                jakarta.persistence.criteria.Join<Object, Object> ticketJoin = root.join("ticketTypes");
                if (minPrice != null) {
                    predicates.add(cb.greaterThanOrEqualTo(ticketJoin.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(cb.lessThanOrEqualTo(ticketJoin.get("price"), maxPrice));
                }
                query.distinct(true);
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
