package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.SlotRequest;
import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.model.Slot;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.repository.DoctorRepository;
import com.springboot.clinic.Care.repository.SlotRepository;
import com.springboot.clinic.Care.repository.UserRepository;
import com.springboot.clinic.Care.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/doctor/slots")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class SlotController {

    private final SlotService slotService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final SlotRepository slotRepository;

    @PostMapping
    public ResponseEntity<String> addSlot(@RequestBody SlotRequest request) {
        slotService.addSlot(request);
        return ResponseEntity.ok("Slot added successfully");
    }

    @GetMapping
    public List<Slot> getAvailableSlotsForDoctorFromNow(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Slot> allSlots = slotRepository.findByDoctorAndDateGreaterThanEqualAndIsBookedFalse(
                doctor, LocalDate.now()
        );

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        return allSlots.stream()
                .filter(slot -> {
                    if (slot.getDate().isAfter(today)) return true;
                    return slot.getDate().isEqual(today) && slot.getTime().isAfter(now);
                })
                .toList();
    }


}
