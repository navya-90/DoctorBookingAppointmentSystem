package com.springboot.clinic.Care.dto;

import lombok.Data;

@Data
public class DoctorUpdateRequest {
    private String name;
    private String specialization;
    private String email;
    private String phone;
}
