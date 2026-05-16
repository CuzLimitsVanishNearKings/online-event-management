package com.javaweb.event_management_backend.EventCatalogue.services.impl;

import com.javaweb.event_management_backend.EventCatalogue.dtos.request.TicketTypeRequestDto;
import com.javaweb.event_management_backend.EventCatalogue.dtos.response.TicketTypeResponseDto;
import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.enums.IssuedTicketStatus;
import com.javaweb.event_management_backend.EventCatalogue.mappers.TicketTypeMapper;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.models.TicketType;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.IssuedTicketRepository;
import com.javaweb.event_management_backend.EventCatalogue.repository.TicketTypeRepository;
import com.javaweb.event_management_backend.EventCatalogue.services.interfaces.TicketTypeService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.exceptions.DuplicateResourceException;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import com.javaweb.event_management_backend.exceptions.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final IssuedTicketRepository issuedTicketRepository;
    private final TicketTypeMapper ticketTypeMapper;

    // ─── PUBLIC ─────────────────────────────────────────────────

    @Override
    public List<TicketTypeResponseDto.Response> getTicketTypesByEvent(Long eventId) {
        Event event = findEventById(eventId);
        return ticketTypeRepository.findByEvent(event)
                .stream()
                .map(ticketTypeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketTypeResponseDto.Response getTicketTypeById(Long ticketTypeId) {
        TicketType ticketType = findTicketTypeById(ticketTypeId);
        return ticketTypeMapper.toResponse(ticketType);
    }

    // ─── ORGANIZER ───────────────────────────────────────────────

    @Override
    @Transactional
    public TicketTypeResponseDto.Response createTicketType(Long eventId,
                                                           TicketTypeRequestDto.CreateTicketType dto,
                                                           User currentUser) {

        Event event = findEventById(eventId);

        // verify ownership
        verifyOwnership(event, currentUser);

        // cannot add ticket types to a cancelled or completed event
        if (event.getStatus() == EventStatus.CANCELLED
                || event.getStatus() == EventStatus.COMPLETED) {
            throw new IllegalArgumentException(
                    "Cannot add ticket types to a "
                            + event.getStatus() + " event");
        }

        // check for duplicate ticket type name on same event
        if (ticketTypeRepository.existsByEventAndNameIgnoreCase(
                event, dto.getName())) {
            throw new DuplicateResourceException(
                    "Ticket type already exists with name: "
                            + dto.getName() + " for this event");
        }

        TicketType ticketType = ticketTypeMapper.toEntity(dto);
        ticketType.setEvent(event);
        ticketTypeRepository.save(ticketType);
        return ticketTypeMapper.toResponse(ticketType);
    }

    @Override
    @Transactional
    public TicketTypeResponseDto.Response updateTicketType(Long ticketTypeId,
                                                           TicketTypeRequestDto.UpdateTicketType dto,
                                                           User currentUser) {

        TicketType ticketType = findTicketTypeById(ticketTypeId);

        // verify ownership through event
        verifyOwnership(ticketType.getEvent(), currentUser);

        // check duplicate name only if name is being changed
        if (dto.getName() != null
                && !dto.getName().equalsIgnoreCase(ticketType.getName())
                && ticketTypeRepository.existsByEventAndNameIgnoreCase(
                ticketType.getEvent(), dto.getName())) {
            throw new DuplicateResourceException(
                    "Ticket type already exists with name: " + dto.getName());
        }

        // if quantity is reduced, make sure it is not
        // less than tickets already sold
        if (dto.getQuantity() != null) {
            long ticketsSold = issuedTicketRepository
                    .countByTicketType(ticketType);
            if (dto.getQuantity() < ticketsSold) {
                throw new IllegalArgumentException(
                        "Cannot reduce quantity below tickets already sold: "
                                + ticketsSold);
            }
            // recalculate quantityRemaining
            ticketType.setQuantityRemaining(
                    dto.getQuantity() - (int) ticketsSold);
        }

        ticketTypeMapper.updateEntity(dto, ticketType);
        ticketTypeRepository.save(ticketType);
        return ticketTypeMapper.toResponse(ticketType);
    }

    @Override
    @Transactional
    public void deleteTicketType(Long ticketTypeId, User currentUser) {
        TicketType ticketType = findTicketTypeById(ticketTypeId);
        verifyOwnership(ticketType.getEvent(), currentUser);

        // cannot delete if tickets have already been sold
        long ticketsSold = issuedTicketRepository.countByTicketType(ticketType);
        if (ticketsSold > 0) {
            throw new IllegalArgumentException(
                    "Cannot delete ticket type with tickets already sold");
        }

        ticketTypeRepository.delete(ticketType);
    }

    @Override
    public List<TicketTypeResponseDto.OrganizerView> getTicketTypesByEventForOrganizer(
            Long eventId, User currentUser) {

        Event event = findEventById(eventId);
        verifyOwnership(event, currentUser);

        return ticketTypeRepository.findByEvent(event)
                .stream()
                .map(tt -> {
                    Integer totalSold = (int) issuedTicketRepository
                            .countByTicketTypeAndStatus(
                                    tt, IssuedTicketStatus.VALID);
                    BigDecimal totalRevenue = tt.getPrice()
                            .multiply(BigDecimal.valueOf(totalSold));
                    return ticketTypeMapper.toOrganizerView(
                            tt, totalSold, totalRevenue);
                })
                .collect(Collectors.toList());
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Event findEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));
    }

    private TicketType findTicketTypeById(Long ticketTypeId) {
        return ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket type not found with id: " + ticketTypeId));
    }

    private void verifyOwnership(Event event, User currentUser) {
        if (!event.getOrganizer().getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to modify this event");
        }
    }
}