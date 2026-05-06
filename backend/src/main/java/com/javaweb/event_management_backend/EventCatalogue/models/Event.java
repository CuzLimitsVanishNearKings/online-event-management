package com.javaweb.event_management_backend.EventCatalogue.models;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Event
{
    @Id
    @Column(name = "event_id")
    @GeneratedValue (strategy =  GenerationType.IDENTITY)
    private Long eventId ;

    @Column(name = "title" , nullable = false)
    private String title ;

    @Column(name = "description" )
    private String description ;

    @Column(name = "venue", nullable = false)
    private String venue ;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime ;

    @Column(name = "end_date_time" , nullable = false)
    private LocalDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status" , nullable = false)
    private EventStatus status ;

    @Column(name = "capacity", nullable = false)
    private int capacity ;

    @Column(name = "cover_image")
    private  String coverImage;

    @Column(name = "created_at" , nullable = false)
    private LocalDateTime createdAt ;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id" , nullable = false)
    private Category category;

    @PrePersist
    protected void FillCreatedTimeOnCreate()
    {
        this.createdAt = LocalDateTime.now();
    }



}
