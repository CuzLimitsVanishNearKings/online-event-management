package com.javaweb.event_management_backend.UserManagement.repository;

import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface OrganizerRepository extends JpaRepository<OrganizerProfile, Long >
{
    Optional<OrganizerProfile> findByOrganizationName(String name);
    
}
