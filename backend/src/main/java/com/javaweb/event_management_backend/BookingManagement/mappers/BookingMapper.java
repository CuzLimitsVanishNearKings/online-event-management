package com.javaweb.event_management_backend.BookingManagement.mappers;

import com.javaweb.event_management_backend.BookingManagement.dtos.response.BookingResponseDto;
import com.javaweb.event_management_backend.BookingManagement.models.Booking;
import com.javaweb.event_management_backend.EventCatalogue.mappers.IssuedTicketMapper;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final IssuedTicketMapper issuedTicketMapper;

    // Entity → DTO

    public BookingResponseDto.Summary toSummary(Booking booking) {

        // navigate chain to get event
        // booking → issuedTickets → first ticket → ticketType → event
        if (booking.getIssuedTickets().isEmpty()) {
            throw new ResourceNotFoundException(
                    "No tickets found for booking: " + booking.getBookingId());
        }
        Event event = booking.getIssuedTickets()
                .get(0)
                .getTicketType()
                .getEvent();

        return BookingResponseDto.Summary.builder()
                .bookingId(booking.getBookingId())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .bookingDate(booking.getBookingDate())
                .eventTitle(event.getTitle())
                .eventVenue(event.getVenue())
                .eventStartDateTime(event.getStartDateTime())
                .ticketCount(booking.getIssuedTickets().size())
                .build();
    }

    public BookingResponseDto.Detail toDetail(Booking booking) {

        // navigate chain to get event
        if (booking.getIssuedTickets().isEmpty()) {
            throw new ResourceNotFoundException(
                    "No tickets found for booking: " + booking.getBookingId());
        }
        Event event = booking.getIssuedTickets()
                .get(0)
                .getTicketType()
                .getEvent();

        // get promotion code if applied
        String promotionCode = booking.getPromotion() != null
                ? booking.getPromotion().getCode()
                : null;

        // calculate discount applied if promotion exists
        java.math.BigDecimal discountApplied = booking.getPromotion() != null
                ? booking.getPromotion().getDiscountValue()
                : java.math.BigDecimal.ZERO;

        return BookingResponseDto.Detail.builder()
                .bookingId(booking.getBookingId())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .bookingDate(booking.getBookingDate())
                .eventTitle(event.getTitle())
                .eventVenue(event.getVenue())
                .eventStartDateTime(event.getStartDateTime())
                .promotionCode(promotionCode)
                .discountApplied(discountApplied)
                .issuedTickets(
                        booking.getIssuedTickets().stream()
                                .map(issuedTicketMapper::toResponse)
                                .collect(Collectors.toList())
                )
                .build();
    }
}