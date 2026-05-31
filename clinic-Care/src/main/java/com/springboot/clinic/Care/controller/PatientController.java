package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.DoctorResponse;
import com.springboot.clinic.Care.dto.SlotInfo;
import com.springboot.clinic.Care.service.DoctorService;
import com.springboot.clinic.Care.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final DoctorService doctorService;
    private final SlotService slotService;

    // 1. List all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // 2. Paginated available slots for a doctor
    @GetMapping("/slots/{doctorId}")
    public ResponseEntity<Page<SlotInfo>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(slotService.getAvailableSlotsForDoctor(doctorId, page, size));
    }
}
