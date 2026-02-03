package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.DoctorAppointmentResponse;
import com.springboot.clinic.Care.dto.DoctorRegisterRequest;
import com.springboot.clinic.Care.dto.DoctorResponse;
import com.springboot.clinic.Care.dto.DoctorUpdateRequest;

import java.util.List;

public interface DoctorService {

    DoctorResponse registerDoctor(DoctorRegisterRequest request);

    DoctorResponse updateDoctor(Long id, DoctorUpdateRequest request);

    void deleteDoctor(Long id);

    long getDoctorCount();

    List<DoctorResponse> getAllDoctors();

    DoctorAppointmentResponse getTodayAppointmentsForDoctor(String doctorEmail);

    void cancelAppointment(Long appointmentId, String doctorEmail);

    void rescheduleAppointment(Long appointmentId, String newDateTime, String doctorEmail);
}
