package com.springboot.clinic.Care.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DoctorRegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private int experience;
    private String licenseNumber;
}
