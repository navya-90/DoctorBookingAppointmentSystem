package com.springboot.clinic.Care.dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String email;
    private String oldPassword;
    private String newPassword;
}
