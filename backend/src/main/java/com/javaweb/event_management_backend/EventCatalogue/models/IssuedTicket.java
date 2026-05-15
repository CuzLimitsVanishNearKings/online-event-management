package com.javaweb.event_management_backend.EventCatalogue.models;


import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "issued_ticket")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IssuedTicket
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issued_ticket_id")
    private Long issuedTicketId;

    @Column(name = "qr_code", nullable = false, unique = true)
    private String qrCode;

    @Column(name = "ticket_code", nullable = false, unique = true)
    private String ticketCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private IssuedTicketStatus status;

    @Column(name = "issued_at", nullable = false, updatable = false)
    private LocalDateTime issuedAt;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_type_id", nullable = false)
    private TicketType ticketType;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @PrePersist
    protected void onCreate() {
        this.issuedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = IssuedTicketStatus.VALID;
        }
    }
}
