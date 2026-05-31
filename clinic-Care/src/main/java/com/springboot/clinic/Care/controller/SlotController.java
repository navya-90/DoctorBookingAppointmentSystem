package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.SlotInfo;
import com.springboot.clinic.Care.dto.SlotRequest;
import com.springboot.clinic.Care.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/slots")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class SlotController {

    private final SlotService slotService;

    @PostMapping
    public ResponseEntity<String> addSlot(@RequestBody SlotRequest request) {
        slotService.addSlot(request);
        return ResponseEntity.ok("Slot added successfully");
    }

    @GetMapping
    public List<SlotInfo> getAvailableSlotsForDoctorFromNow(Authentication authentication) {
        String email = authentication.getName();
        return slotService.getAvailableSlotsForDoctorFromNow(email);
    }
}
