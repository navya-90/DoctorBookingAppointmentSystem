package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.DoctorAppointmentResponse;
import com.springboot.clinic.Care.repository.DoctorRepository;
import com.springboot.clinic.Care.security.UserDetailsImplementation;
import com.springboot.clinic.Care.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;

    @GetMapping("/appointments")
    public ResponseEntity<DoctorAppointmentResponse> getDoctorDashboard(Authentication authentication) {
        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();
        String email = userDetails.getEmail();
        DoctorAppointmentResponse response = doctorService.getTodayAppointmentsForDoctor(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/appointments/{appointmentId}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId, Authentication authentication) {
        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();
        String email = userDetails.getEmail();
        doctorService.cancelAppointment(appointmentId, email);
        return ResponseEntity.ok("Appointment cancelled and user notified.");
    }

    @PostMapping("/appointments/{appointmentId}/reschedule")
    public ResponseEntity<String> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestParam String newDateTime, // ISO format: "2025-07-25T14:00"
            Authentication authentication
    ) {
        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();
        String email = userDetails.getEmail();
        doctorService.rescheduleAppointment(appointmentId, newDateTime, email);
        return ResponseEntity.ok("Appointment rescheduled and user notified.");
    }

    @GetMapping("/{doctorId}/patient-count")
    public ResponseEntity<Long> getPatientCount(@PathVariable Long doctorId) {
        long count = doctorRepository.countDistinctPatientsByDoctorId(doctorId);
        return ResponseEntity.ok(count);
    }

}
