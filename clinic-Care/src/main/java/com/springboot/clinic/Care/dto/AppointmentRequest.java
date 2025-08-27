package com.springboot.clinic.Care.dto;

import lombok.*;


@Data
public class AppointmentRequest {
    private Long slotId;
    private String patientName;
    private String gender;
    private int age;
    private String address;

}
