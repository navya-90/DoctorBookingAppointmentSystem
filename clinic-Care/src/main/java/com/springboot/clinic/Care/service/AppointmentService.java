package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.AppointmentRequest;
import com.springboot.clinic.Care.dto.AppointmentResponse;
import com.springboot.clinic.Care.model.Status;

import java.nio.file.AccessDeniedException;

public interface AppointmentService {

    AppointmentResponse bookAppointment(String email, AppointmentRequest request) throws Exception;

    void updateStatus(Long appointmentId, Status newStatus, String doctorEmail) throws AccessDeniedException;

    long getTodaysAppointmentCount();
}
