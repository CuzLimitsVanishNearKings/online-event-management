package com.javaweb.event_management_backend.UserManagement.repository;

import com.javaweb.event_management_backend.UserManagement.models.OrganizerProfile;
import com.javaweb.event_management_backend.UserManagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrganizerRepository extends JpaRepository<OrganizerProfile, Long >
{
    List<OrganizerProfile> findByOrganizationName(String name);

    Optional<OrganizerProfile> findByUser(User user);

    boolean existsByUser(User user);
}
