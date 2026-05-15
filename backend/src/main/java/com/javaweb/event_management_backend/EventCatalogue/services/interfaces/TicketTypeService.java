package com.javaweb.event_management_backend.EventCatalogue.services.interfaces;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.TicketTypeRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.TicketTypeResponseDto;
import com.javaweb.event_management_backend.UserManagement.models.User;

import java.util.List;

public interface TicketTypeService {

    // ─── PUBLIC ─────────────────────────────────────────────────

    // Get all ticket types for an event — event detail page
    List<TicketTypeResponseDto.Response> getTicketTypesByEvent(Long eventId);

    // Get ticket type by id
    TicketTypeResponseDto.Response getTicketTypeById(Long ticketTypeId);

    // ─── ORGANIZER ───────────────────────────────────────────────

    // Add a new ticket type to an event
    TicketTypeResponseDto.Response createTicketType(Long eventId,
                                                    TicketTypeRequestDto.CreateTicketType dto,
                                                    User currentUser);

    // Update an existing ticket type
    TicketTypeResponseDto.Response updateTicketType(Long ticketTypeId,
                                                    TicketTypeRequestDto.UpdateTicketType dto,
                                                    User currentUser);

    // Delete a ticket type
    void deleteTicketType(Long ticketTypeId, User currentUser);

    // Get all ticket types for an event with sales stats
    // organizer dashboard
    List<TicketTypeResponseDto.OrganizerView> getTicketTypesByEventForOrganizer(
            Long eventId, User currentUser);
}