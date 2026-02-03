package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.repository.DoctorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotSchedulerServiceImpl implements SlotSchedulerService{

    private final SlotService slotService;
    private final DoctorRepository doctorRepository;

    @Override
    @Scheduled(cron = "0 0 0 * * ?") // Runs at midnight every day
    @Transactional
    public void extendSlotsForAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        for (Doctor doctor : doctors) {
            slotService.extendSlotsForDoctor(doctor, 1); // Extends by 1 day
        }
    }
}
