package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.DoctorResponse;
import com.springboot.clinic.Care.dto.SlotInfo;
import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.model.Slot;
import com.springboot.clinic.Care.repository.DoctorRepository;
import com.springboot.clinic.Care.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final DoctorRepository doctorRepository;
    private final SlotRepository slotRepository;

    // 1. List all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<DoctorResponse> response = doctors.stream().map(doctor ->
                    DoctorResponse.builder()
                            .id(doctor.getId())
                            .name(doctor.getUser().getName())
                            .phone(doctor.getUser().getPhone())
                            .specialization(doctor.getSpecialization())
                            .experience(doctor.getExperience())
                            .build()
        ).toList();
        return ResponseEntity.ok(response);
    }

    // 2. Paginated available slots for a doctor
    @GetMapping("/slots/{doctorId}")
    public ResponseEntity<Page<SlotInfo>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        LocalDate today = LocalDate.now(); // Get current date

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").ascending().and(Sort.by("time")));

        // Fetch slots where appointment is null AND date >= today
        Page<Slot> slots = slotRepository.findByDoctorIdAndAppointmentIsNullAndDateGreaterThanEqual(
                doctorId,
                today,
                pageable
        );

        Page<SlotInfo> result = slots.map(slot -> new SlotInfo(
                slot.getId(),
                slot.getDate(),
                slot.getTime()
        ));

        return ResponseEntity.ok(result);
    }
}
