package com.springboot.clinic.Care.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private int age;
    private String address;
}
