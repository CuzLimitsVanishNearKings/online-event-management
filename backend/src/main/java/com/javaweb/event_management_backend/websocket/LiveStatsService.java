package com.javaweb.event_management_backend.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LiveStatsService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public LiveStatsService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastEventUpdate(Long eventId, Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/events/" + eventId, (Object) payload);
    }

    public void broadcastOrganizerStats(Long organizerId, Map<String, Object> stats) {
        messagingTemplate.convertAndSend("/topic/organizer/" + organizerId + "/stats", (Object) stats);
    }

    public void broadcastAdminStats(Map<String, Object> stats) {
        messagingTemplate.convertAndSend("/topic/admin/stats", (Object) stats);
    }
}
