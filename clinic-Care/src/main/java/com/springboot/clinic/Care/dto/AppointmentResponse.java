package com.springboot.clinic.Care.dto;

import com.springboot.clinic.Care.model.Slot;
import com.springboot.clinic.Care.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String doctorName;
    private String patientName;
    private Status status;
    private boolean paymentDone;
}
