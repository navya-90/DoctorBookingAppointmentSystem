package com.springboot.clinic.Care.dto;

import com.springboot.clinic.Care.model.PlanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private PlanType planType;
    private boolean isValid;
}
