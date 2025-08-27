package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.AppointmentRequest;
import com.springboot.clinic.Care.dto.AppointmentResponse;
import com.springboot.clinic.Care.model.Status;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.security.UserDetailsImplementation;
import com.springboot.clinic.Care.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> book(@RequestBody AppointmentRequest request, Authentication authentication) throws Exception {
        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();
        String email = userDetails.getEmail();
        System.out.println(email);
        return ResponseEntity.ok(appointmentService.bookAppointment(email, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam Status status,
            Authentication authentication) {

        String doctorEmail = authentication.getName();
        try {
            appointmentService.updateStatus(id, status, doctorEmail);
        } catch (AccessDeniedException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Appointment status updated to " + status);
    }

}
