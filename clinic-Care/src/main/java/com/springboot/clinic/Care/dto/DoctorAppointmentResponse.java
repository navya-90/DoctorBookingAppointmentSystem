package com.springboot.clinic.Care.dto;

import com.springboot.clinic.Care.model.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class DoctorAppointmentResponse {
    private int totalAppointments;
    private List<AppointmentInfo> appointments;

    @AllArgsConstructor
    @Getter
    @Setter
    @NoArgsConstructor
    public static class AppointmentInfo {
        private String time;
        private String patientName;
        private Status status;
    }
}
