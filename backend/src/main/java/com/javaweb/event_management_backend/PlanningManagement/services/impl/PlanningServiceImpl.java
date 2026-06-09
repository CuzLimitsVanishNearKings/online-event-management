package com.javaweb.event_management_backend.PlanningManagement.services.impl;

import com.javaweb.event_management_backend.EventCatalogue.enums.EventStatus;
import com.javaweb.event_management_backend.EventCatalogue.models.Event;
import com.javaweb.event_management_backend.EventCatalogue.repository.EventRepository;
import com.javaweb.event_management_backend.PlanningManagement.dtos.response.PlanningResponseDto;
import com.javaweb.event_management_backend.PlanningManagement.mappers.PlanningMapper;
import com.javaweb.event_management_backend.PlanningManagement.models.Planning;
import com.javaweb.event_management_backend.PlanningManagement.repository.PlanningRepository;
import com.javaweb.event_management_backend.PlanningManagement.services.interfaces.PlanningService;
import com.javaweb.event_management_backend.UserManagement.models.User;
import com.javaweb.event_management_backend.exceptions.DuplicateResourceException;
import com.javaweb.event_management_backend.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanningServiceImpl implements PlanningService
{
    private final PlanningRepository planningRepository;
    private final EventRepository eventRepository;
    private final PlanningMapper planningMapper;

    @Override
    @Transactional
    public PlanningResponseDto.SavedEvent saveEvent(Long eventId, User currentUser)
    {
        Event event = findEventById(eventId);

        // only published events can be saved
        if (event.getStatus() != EventStatus.PUBLISHED)
        {
            throw new IllegalArgumentException(
                    "Only published events can be saved to planning");
        }

        // check if already saved
        if (planningRepository.existsByUserAndEvent(currentUser, event))
        {
            throw new DuplicateResourceException(
                    "Event already saved to your planning");
        }

        Planning planning = Planning.builder()
                .user(currentUser)
                .event(event)
                .build();

        planningRepository.save(planning);
        return planningMapper.toSavedEvent(planning);
    }

    @Override
    @Transactional
    public void removeEvent(Long eventId, User currentUser)
    {
        Event event = findEventById(eventId);

        if (!planningRepository.existsByUserAndEvent(currentUser, event))
        {
            throw new ResourceNotFoundException(
                    "Event not found in your planning");
        }

        planningRepository.deleteByUserAndEvent(currentUser, event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanningResponseDto.SavedEvent> getMyPlanning(User currentUser)
    {
        return planningRepository
                .findByUserOrderBySavedAtDesc(currentUser)
                .stream()
                .map(planningMapper::toSavedEvent)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlanningResponseDto.SavedEvent checkIfSaved(Long eventId, User currentUser)
    {
        Event event = findEventById(eventId);

        return planningRepository
                .findByUserAndEvent(currentUser, event)
                .map(planningMapper::toSavedEvent)
                .orElse(planningMapper.toNotSaved(event));
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────

    private Event findEventById(Long eventId)
    {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));
    }
}