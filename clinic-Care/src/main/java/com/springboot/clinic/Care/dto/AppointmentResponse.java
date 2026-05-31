package com.springboot.clinic.Care.dto;

import com.springboot.clinic.Care.model.Slot;
import com.springboot.clinic.Care.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String patientName;
    private Status status;
    private boolean paymentDone;
    private LocalDate date;
    private LocalTime time;
    private String cancellationReason;
    private String rescheduleHistory;
}
