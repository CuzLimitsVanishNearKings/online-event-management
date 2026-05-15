package com.javaweb.event_management_backend.EventCatalogue.mappers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.EventRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.EventResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final CategoryMapper categoryMapper;
    private final TicketTypeMapper ticketTypeMapper;

    // Entity → DTO

    public EventResponseDto.Summary toSummary(Event event) {
        return EventResponseDto.Summary.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .venue(event.getVenue())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .status(event.getStatus())
                .coverImage(event.getCoverImage())
                .category(categoryMapper.toSummary(event.getCategory()))
                .organizerName(event.getOrganizer().getOrganizationName())
                .organizerLogoUrl(event.getOrganizer().getLogoUrl())
                .build();
    }

    public EventResponseDto.Detail toDetail(Event event) {
        return EventResponseDto.Detail.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .capacity(event.getCapacity())
                .status(event.getStatus())
                .coverImage(event.getCoverImage())
                .createdAt(event.getCreatedAt())
                .category(categoryMapper.toDetail(event.getCategory()))
                .organizerName(event.getOrganizer().getOrganizationName())
                .organizerLogoUrl(event.getOrganizer().getLogoUrl())
                .organizerDescription(event.getOrganizer().getDescription())
                .ticketTypes(
                        event.getTicketTypes().stream()
                                .map(ticketTypeMapper::toResponse)
                                .collect(Collectors.toList())
                )
                .build();
    }

    public EventResponseDto.OrganizerView toOrganizerView(Event event,
                                                          Integer totalTicketsSold,
                                                          Integer totalTicketsRemaining,
                                                          java.math.BigDecimal totalRevenue) {
        return EventResponseDto.OrganizerView.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .venue(event.getVenue())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .capacity(event.getCapacity())
                .status(event.getStatus())
                .coverImage(event.getCoverImage())
                .totalTicketsSold(totalTicketsSold)
                .totalTicketsRemaining(totalTicketsRemaining)
                .totalRevenue(totalRevenue)
                .build();
    }

    // DTO → Entity
    public Event toEntity(EventRequestDto.CreateEvent dto) {
        return Event.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .venue(dto.getVenue())
                .startDateTime(dto.getStartDateTime())
                .endDateTime(dto.getEndDateTime())
                .capacity(dto.getCapacity())
                .coverImage(dto.getCoverImage())
                .build();
        // Note: category and organizer are set in the service layer
        // after being fetched from the database
    }

    // Update existing entity from DTO
    // only update fields that are not null
    public void updateEntity(EventRequestDto.UpdateEvent dto, Event event) {
        if (dto.getTitle() != null) {
            event.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            event.setDescription(dto.getDescription());
        }
        if (dto.getVenue() != null) {
            event.setVenue(dto.getVenue());
        }
        if (dto.getStartDateTime() != null) {
            event.setStartDateTime(dto.getStartDateTime());
        }
        if (dto.getEndDateTime() != null) {
            event.setEndDateTime(dto.getEndDateTime());
        }
        if (dto.getCapacity() != null) {
            event.setCapacity(dto.getCapacity());
        }
        if (dto.getCoverImage() != null) {
            event.setCoverImage(dto.getCoverImage());
        }
    }
}