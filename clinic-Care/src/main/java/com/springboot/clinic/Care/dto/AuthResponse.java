package com.springboot.clinic.Care.dto;

import com.springboot.clinic.Care.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String message;
}
