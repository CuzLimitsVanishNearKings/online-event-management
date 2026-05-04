package com.javaweb.event_management_backend.UserManagement.models;


import com.javaweb.event_management_backend.UserManagement.enums.UserRole;
import com.javaweb.event_management_backend.UserManagement.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User
{
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "first_name" , nullable = false)
    private String firstName;

    @Column(name = "last_name" , nullable = false)
    private String lastName ;


    @Column(name = "email" , nullable = false , unique = true)
    private String email ;

    @Column(name =  "password")
    private String passwordHash ;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role ;

    @Enumerated(EnumType.STRING)
    @Column(name  = "status" ,nullable = false)
    private UserStatus status ;

    @Column(name = "profile_pic")
    private String profilePic ;

    @Column(nullable = false , name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void FillCreatedTimeOnCreate()
    {
        this.createdAt = LocalDateTime.now();
    }


}
