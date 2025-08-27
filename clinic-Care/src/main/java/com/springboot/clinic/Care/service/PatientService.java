package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.PatientRegisterRequest;
import com.springboot.clinic.Care.dto.PatientResponse;
import com.springboot.clinic.Care.model.Patient;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.repository.PatientRepository;
import com.springboot.clinic.Care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientResponse registerPatient(String email, PatientRegisterRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = Patient.builder()
                .name(request.getName())
                .gender(request.getGender())
                .age(request.getAge())
                .address(request.getAddress())
                .user(user)
                .build();

        patientRepository.save(patient);

        return mapToPatientResponse(patient);
    }

    public Patient getPatientByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToPatientResponse)
                .collect(Collectors.toList());
    }

    public long getPatientCount() {
        return patientRepository.count();
    }

    private PatientResponse mapToPatientResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setName(patient.getName());
        response.setEmail(patient.getUser().getEmail());
        response.setPhone(patient.getUser().getPhone());
        response.setGender(patient.getGender());
        response.setAge(patient.getAge());
        response.setAddress(patient.getAddress());
        return response;
    }
}
