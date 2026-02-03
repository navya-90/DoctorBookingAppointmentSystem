package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.AppointmentRequest;
import com.springboot.clinic.Care.dto.AppointmentResponse;
import com.springboot.clinic.Care.model.*;
import com.springboot.clinic.Care.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService{

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final SlotRepository slotRepository;
    private final SubscriptionService subscriptionService;

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(String email, AppointmentRequest request) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getAppointment() != null) {
            throw new RuntimeException("Slot already booked");
        }

        Subscription subscription = subscriptionService.getUserSubscription(user.getId());

        // Validate subscription (blocks after 3 free appointments)
        if (!subscriptionService.isValid(subscription, user)) {
            throw new RuntimeException(
                    subscription.getPlanType() == PlanType.FREE
                            ? "You've used all 3 free appointments. Upgrade to book more."
                            : "Your subscription has expired. Please renew."
            );
        }

        // 4. Create the patient
        Patient patient = Patient.builder()
                .name(request.getPatientName())
                .age(request.getAge())
                .gender(request.getGender())
                .address(request.getAddress())
                .user(user)
                .build();
        patientRepository.save(patient);

        // Create appointment
        boolean isFree = subscription.getPlanType() == PlanType.FREE;
        Appointment appointment = Appointment.builder()
                .user(user)
                .doctor(slot.getDoctor())
                .patient(patient) // Separate method for patient creation
                .slot(slot)
                .status(Status.SCHEDULED)
                .paymentDone(isFree) // True for free plan appointments
                .build();

        // Save and return
        Appointment saved = appointmentRepository.save(appointment);
        slot.setAppointment(saved);
        slotRepository.save(slot);
        return buildAppointmentResponse(saved);
    }


    @Override
    @Transactional
    public void updateStatus(Long appointmentId, Status newStatus, String doctorEmail)
            throws AccessDeniedException {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new AccessDeniedException("You are not authorized to update this appointment");
        }

        appointment.setStatus(newStatus);
        appointmentRepository.save(appointment);
    }

    @Override
    public long getTodaysAppointmentCount() {
        LocalDate today = LocalDate.now();
        return appointmentRepository.countBySlot_Date(today); // assuming `date` is of type LocalDate
    }

    private AppointmentResponse buildAppointmentResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctor().getUser().getName(),
                appointment.getPatient().getUser().getName(),
                appointment.getStatus(),
                appointment.isPaymentDone()
        );
    }
}