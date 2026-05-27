package com.ecoscan.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    // Common
    private String email;
    private String password;
    private String role; // "user" or "reclaimer"

    // User fields
    private String name;
    private String phone;
    private String address;
    private String village;
    private String pincode;

    // Reclaimer fields
    private String companyName;
}
