package com.springboot.clinic.Care.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotRequest {
    private LocalDate date;
    private LocalTime time;
}
