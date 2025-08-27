package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.DoctorRegisterRequest;
import com.springboot.clinic.Care.dto.DoctorResponse;
import com.springboot.clinic.Care.dto.DoctorUpdateRequest;
import com.springboot.clinic.Care.dto.PatientResponse;
import com.springboot.clinic.Care.service.AppointmentService;
import com.springboot.clinic.Care.service.DoctorService;
import com.springboot.clinic.Care.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @PostMapping("/add-doctor")
    public ResponseEntity<DoctorResponse> addDoctor(@RequestBody DoctorRegisterRequest request) {
        DoctorResponse doctor = doctorService.registerDoctor(request);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PutMapping("/edit-doctor/{id}")
    public ResponseEntity<DoctorResponse> updateDoctor(@PathVariable Long id, @RequestBody DoctorUpdateRequest request) {
        DoctorResponse updatedDoctor = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/delete-doctor/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<Map<String, Long>> getDashboardSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalDoctors", doctorService.getDoctorCount());
        summary.put("totalPatients", patientService.getPatientCount());
        summary.put("appointmentsToday", appointmentService.getTodaysAppointmentCount());
        return ResponseEntity.ok(summary);
    }

}
