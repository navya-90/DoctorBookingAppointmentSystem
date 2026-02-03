package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.SlotRequest;
import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.model.Slot;

import java.time.LocalDate;
import java.util.List;

public interface SlotService {

    void initializeDefaultSlots(Doctor doctor);

    void addSlot(SlotRequest request);

    List<Slot> getSlotsForDoctorToday(LocalDate date);

    void extendSlotsForDoctor(Doctor doctor, int daysToAdd);

    void generateSlotsBetween(Doctor doctor, LocalDate startDate, LocalDate endDate);
}
