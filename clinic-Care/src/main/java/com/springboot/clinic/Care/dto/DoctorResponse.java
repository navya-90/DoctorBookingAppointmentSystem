package com.springboot.clinic.Care.dto;

import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DoctorResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private int experience;
    private String licenseNumber;
    private List<SlotInfo> availableSlots;


}
