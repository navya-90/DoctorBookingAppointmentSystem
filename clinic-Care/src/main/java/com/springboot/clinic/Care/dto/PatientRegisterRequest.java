package com.springboot.clinic.Care.dto;

import lombok.Data;

@Data
public class PatientRegisterRequest {
    private String name;
    private String gender;
    private int age;
    private String address;
}
