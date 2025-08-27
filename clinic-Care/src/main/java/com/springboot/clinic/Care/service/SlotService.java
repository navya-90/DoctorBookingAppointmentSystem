package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.SlotRequest;
import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.model.Slot;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.repository.DoctorRepository;
import com.springboot.clinic.Care.repository.SlotRepository;
import com.springboot.clinic.Care.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotRepository slotRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public void initializeDefaultSlots(Doctor doctor) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(30);

        List<Slot> slots = new ArrayList<>();

        // Create slots for each day
        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            // Skip weekends
            if (date.getDayOfWeek() == DayOfWeek.SATURDAY ||
                    date.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }

            // Morning slots (9AM-12PM)
            for (int hour = 9; hour < 12; hour++) {
                slots.add(createSlot(doctor, date, hour, 0));
            }

            // Afternoon slots (2PM-5PM)
            for (int hour = 14; hour < 17; hour++) {
                slots.add(createSlot(doctor, date, hour, 0));
            }
        }

        slotRepository.saveAll(slots);
    }

    private Slot createSlot(Doctor doctor, LocalDate date, int hour, int minute) {
        return Slot.builder()
                .doctor(doctor)
                .date(date)
                .time(LocalTime.of(hour, minute))
                .isBooked(false)
                .build();
    }

    public void addSlot(SlotRequest request) {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean exists = slotRepository.existsByDoctorAndDateAndTime(doctor, request.getDate(), request.getTime());
        if (exists) {
            throw new RuntimeException("Slot already exists.");
        }

        Slot slot = Slot.builder()
                .doctor(doctor)
                .date(request.getDate())
                .time(request.getTime())
                .isBooked(false)
                .build();

        slotRepository.save(slot);
    }

    public List<Slot> getSlotsForDoctorToday(LocalDate date) {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return slotRepository.findByDoctorAndDateAfterOrDateEquals(doctor, LocalDate.now(), LocalDate.now());

    }

    @Transactional
    public void extendSlotsForDoctor(Doctor doctor, int daysToAdd) {
        LocalDate lastAvailableDate = slotRepository.findLastDateByDoctor(doctor)
                .orElse(LocalDate.now()); // If no slots, start from today

        // Only extend if needed (avoid regenerating past slots)
        if (lastAvailableDate.isBefore(LocalDate.now())) {
            lastAvailableDate = LocalDate.now();
        }

        LocalDate newEndDate = lastAvailableDate.plusDays(daysToAdd);
        generateSlotsBetween(doctor, lastAvailableDate.plusDays(1), newEndDate);
    }

    public void generateSlotsBetween(Doctor doctor, LocalDate startDate, LocalDate endDate) {
        // Doctor's working hours (example: 9 AM to 5 PM)
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0);

        // Slot duration (e.g., 30 minutes)
        int slotDurationMinutes = 30;

        // Generate slots for each day in the range
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            generateSlotsForDay(doctor, date, startTime, endTime, slotDurationMinutes);
        }
    }

    private void generateSlotsForDay(Doctor doctor, LocalDate date, LocalTime startTime, LocalTime endTime, int slotDurationMinutes) {
        List<Slot> existingSlots = slotRepository.findByDoctorAndDate(doctor, date);

        LocalTime currentTime = startTime;
        while (currentTime.plusMinutes(slotDurationMinutes).isBefore(endTime) ||
                currentTime.plusMinutes(slotDurationMinutes).equals(endTime)) {

            final LocalTime slotTime = currentTime;

            // Check if slot already exists
            boolean slotExists = existingSlots.stream()
                    .anyMatch(slot -> slot.getTime().equals(slotTime));

            if (!slotExists) {
                Slot newSlot = Slot.builder()
                        .doctor(doctor)
                        .date(date)
                        .time(currentTime)
                        .build();
                slotRepository.save(newSlot);
            }

            currentTime = currentTime.plusMinutes(slotDurationMinutes);
        }
    }
}
