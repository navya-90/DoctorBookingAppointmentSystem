package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.PatientRegisterRequest;
import com.springboot.clinic.Care.dto.PatientResponse;
import com.springboot.clinic.Care.model.Patient;

import java.util.List;

public interface PatientService {

    PatientResponse registerPatient(String email, PatientRegisterRequest request);

    Patient getPatientByEmail(String email);

    List<PatientResponse> getAllPatients();

    long getPatientCount();
}
