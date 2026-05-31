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
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService{

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final SlotRepository slotRepository;
    private final SubscriptionService subscriptionService;
    private final EmailService emailService;

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

        // 4. Create or reuse the patient profile
        java.util.Optional<Patient> existingPatient = patientRepository.findByUserAndNameAndAgeAndGender(
                user, request.getPatientName(), request.getAge(), request.getGender());

        Patient patient;
        if (existingPatient.isPresent()) {
            patient = existingPatient.get();
            if (request.getAddress() != null && !request.getAddress().equals(patient.getAddress())) {
                patient.setAddress(request.getAddress());
                patientRepository.save(patient);
            }
        } else {
            patient = Patient.builder()
                    .name(request.getPatientName())
                    .age(request.getAge())
                    .gender(request.getGender())
                    .address(request.getAddress())
                    .user(user)
                    .build();
            patientRepository.save(patient);
        }

        // Create appointment
        Appointment appointment = Appointment.builder()
                .user(user)
                .doctor(slot.getDoctor())
                .patient(patient) // Separate method for patient creation
                .slot(slot)
                .appointmentDate(slot.getDate())
                .appointmentTime(slot.getTime())
                .status(Status.SCHEDULED)
                .paymentDone(true) // Covered by active subscription (free or paid)
                .build();

        // Save and return
        Appointment saved = appointmentRepository.save(appointment);
        slot.setAppointment(saved);
        slot.setBooked(true);
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
        return appointmentRepository.countByAppointmentDateAndStatusNot(today, Status.CANCELLED);
    }

    private AppointmentResponse buildAppointmentResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getUser().getName(),
                appointment.getPatient().getUser().getName(),
                appointment.getStatus(),
                appointment.isPaymentDone(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getCancellationReason(),
                appointment.getRescheduleHistory()
        );
    }

    @Override
    public List<AppointmentResponse> getPatientAppointments(String email) {
        return appointmentRepository.findByUserEmail(email).stream()
                .map(this::buildAppointmentResponse)
                .toList();
    }

    @Override
    @Transactional
    public void patientCancelAppointment(Long appointmentId, String email, String reason) throws Exception {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException("You can only cancel your own appointments");
        }

        if (appointment.getStatus() == Status.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed appointment");
        }
        if (appointment.getStatus() == Status.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus(Status.CANCELLED);
        appointment.setCancellationReason(reason);

        Slot slot = appointment.getSlot();
        if (slot != null) {
            slot.setBooked(false);
            slot.setAppointment(null);
            slotRepository.save(slot);
        }
        appointment.setSlot(null); // Sever slot reference to free it for other bookings

        appointmentRepository.save(appointment);

        // Notify doctor via email
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        String subject = "Appointment Cancelled by Patient";
        String body = String.format(
                "Dear Dr. %s,\n\nAn appointment scheduled for %s at %s has been cancelled by patient %s.\nReason: %s\n\nRegards,\nClinicCare Support",
                appointment.getDoctor().getUser().getName(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getPatient().getName(),
                (reason != null && !reason.trim().isEmpty()) ? reason : "No reason provided"
        );
        emailService.sendEmail(doctorEmail, subject, body);
    }

    @Override
    @Transactional
    public AppointmentResponse patientRescheduleAppointment(Long appointmentId, String email, Long newSlotId) throws Exception {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException("You can only reschedule your own appointments");
        }

        if (appointment.getStatus() == Status.COMPLETED) {
            throw new RuntimeException("Cannot reschedule a completed appointment");
        }
        if (appointment.getStatus() == Status.CANCELLED) {
            throw new RuntimeException("Cannot reschedule a cancelled appointment");
        }

        Slot newSlot = slotRepository.findById(newSlotId)
                .orElseThrow(() -> new RuntimeException("New slot not found"));

        if (newSlot.isBooked() || newSlot.getAppointment() != null) {
            throw new RuntimeException("Selected slot is already booked");
        }

        if (!newSlot.getDoctor().getId().equals(appointment.getDoctor().getId())) {
            throw new RuntimeException("Selected slot does not belong to the same doctor");
        }

        Slot oldSlot = appointment.getSlot();
        if (oldSlot != null) {
            oldSlot.setBooked(false);
            oldSlot.setAppointment(null);
            slotRepository.save(oldSlot);
        }

        // Preserve history in text column
        String oldDateTimeStr = appointment.getAppointmentDate() + " " + appointment.getAppointmentTime();
        String newDateTimeStr = newSlot.getDate() + " " + newSlot.getTime();
        String historyEntry = "Rescheduled from " + oldDateTimeStr + " to " + newDateTimeStr + "\n";
        String existingHistory = appointment.getRescheduleHistory();
        appointment.setRescheduleHistory(existingHistory == null ? historyEntry : existingHistory + historyEntry);

        // Update to new slot
        appointment.setSlot(newSlot);
        appointment.setAppointmentDate(newSlot.getDate());
        appointment.setAppointmentTime(newSlot.getTime());
        appointment.setStatus(Status.RESCHEDULED);

        newSlot.setBooked(true);
        newSlot.setAppointment(appointment);
        slotRepository.save(newSlot);

        Appointment saved = appointmentRepository.save(appointment);

        // Notify doctor via email
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        String subject = "Appointment Rescheduled by Patient";
        String body = String.format(
                "Dear Dr. %s,\n\nAn appointment has been rescheduled by patient %s.\nOld Date/Time: %s\nNew Date/Time: %s %s\n\nRegards,\nClinicCare Support",
                appointment.getDoctor().getUser().getName(),
                appointment.getPatient().getName(),
                oldDateTimeStr,
                newSlot.getDate(),
                newSlot.getTime()
        );
        emailService.sendEmail(doctorEmail, subject, body);

        return buildAppointmentResponse(saved);
    }
}