package com.javaweb.event_management_backend.PlanningManagement.models;

import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.UserManagement.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "planning",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "event_id"},
                name = "uk_planning_user_event"
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Planning
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "planning_id")
    private Long planningId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;

    @PrePersist
    protected void onCreate()
    {
        this.savedAt = LocalDateTime.now();
    }
}