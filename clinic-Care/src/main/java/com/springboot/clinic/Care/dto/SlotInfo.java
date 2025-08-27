package com.springboot.clinic.Care.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SlotInfo {
    private Long id;
    private LocalDate date;
    private LocalTime time;
}
