package com.javaweb.event_management_backend.EventCatalogue.mappers;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.TicketTypeRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.TicketTypeResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import org.springframework.stereotype.Component;

@Component
public class TicketTypeMapper {

    // Entity → DTO
    public TicketTypeResponseDto.Response toResponse(TicketType ticketType) {
        return TicketTypeResponseDto.Response.builder()
                .ticketTypeId(ticketType.getTicketTypeId())
                .name(ticketType.getName())
                .price(ticketType.getPrice())
                .quantity(ticketType.getQuantity())
                .quantityRemaining(ticketType.getQuantityRemaining())
                .createdAt(ticketType.getCreatedAt())
                .build();
    }

    public TicketTypeResponseDto.OrganizerView toOrganizerView(TicketType ticketType,
                                                               Integer totalSold,
                                                               java.math.BigDecimal totalRevenue) {
        return TicketTypeResponseDto.OrganizerView.builder()
                .ticketTypeId(ticketType.getTicketTypeId())
                .name(ticketType.getName())
                .price(ticketType.getPrice())
                .quantity(ticketType.getQuantity())
                .quantityRemaining(ticketType.getQuantityRemaining())
                .totalSold(totalSold)
                .totalRevenue(totalRevenue)
                .build();
    }

    // DTO → Entity
    public TicketType toEntity(TicketTypeRequestDto.CreateTicketType dto) {
        return TicketType.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .build();
        // Note: event is set in the service layer
        // quantityRemaining is auto-set in @PrePersist
    }

    // Update existing entity from DTO
    // only update fields that are not null
    public void updateEntity(TicketTypeRequestDto.UpdateTicketType dto, TicketType ticketType) {
        if (dto.getName() != null) {
            ticketType.setName(dto.getName());
        }
        if (dto.getPrice() != null) {
            ticketType.setPrice(dto.getPrice());
        }
        if (dto.getQuantity() != null) {
            ticketType.setQuantity(dto.getQuantity());
        }
    }
}