package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.AppointmentRequest;
import com.springboot.clinic.Care.dto.AppointmentResponse;
import com.springboot.clinic.Care.model.Status;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface AppointmentService {

    AppointmentResponse bookAppointment(String email, AppointmentRequest request) throws Exception;

    void updateStatus(Long appointmentId, Status newStatus, String doctorEmail) throws AccessDeniedException;

    long getTodaysAppointmentCount();

    List<AppointmentResponse> getPatientAppointments(String email);

    void patientCancelAppointment(Long appointmentId, String email, String reason) throws Exception;

    AppointmentResponse patientRescheduleAppointment(Long appointmentId, String email, Long newSlotId) throws Exception;
}
