package com.javaweb.event_management_backend.UserManagement.exceptions;

public class EmailAlreadyExistsException extends RuntimeException
{
    public EmailAlreadyExistsException(String message)
    {
        super(message);
    }
}