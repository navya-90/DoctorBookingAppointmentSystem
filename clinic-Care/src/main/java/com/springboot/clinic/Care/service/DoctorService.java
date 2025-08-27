package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.*;
import com.springboot.clinic.Care.model.*;
import com.springboot.clinic.Care.repository.AppointmentRepository;
import com.springboot.clinic.Care.repository.DoctorRepository;
import com.springboot.clinic.Care.repository.SlotRepository;
import com.springboot.clinic.Care.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SlotRepository slotRepository;
    private final SlotService slotService;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public DoctorResponse registerDoctor(DoctorRegisterRequest request) {
        // 1. Create user with encoded password
        String plainPassword = generateRandomPassword();
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(Role.DOCTOR)
                .password(passwordEncoder.encode(plainPassword))
                .build();

        userRepository.save(user);

        // 2. Create doctor profile
        Doctor doctor = Doctor.builder()
                .specialization(request.getSpecialization())
                .experience(request.getExperience())
                .licenseNumber(request.getLicenseNumber())
                .user(user)
                .build();

        doctorRepository.save(doctor);

        // 3. Initialize default slots for the doctor (next 30 days)
        slotService.initializeDefaultSlots(doctor);


        String userEmail = user.getEmail();
        String subject = "ClinicCare: Your Doctor Account Created";
        String body = "Welcome to ClinicCare!\n\nYour login credentials:\nEmail: " + user.getEmail() +
                "\nPassword: " + plainPassword + "\n\nPlease change your password after login.";

        emailService.sendEmail(userEmail,subject,body);
//        emailService.sendEmail(
//                user.getEmail(),
//                "ClinicCare: Your Doctor Account Created",
//                "Welcome to ClinicCare!\n\nYour login credentials:\nEmail: " + user.getEmail() +
//                        "\nPassword: " + plainPassword + "\n\nPlease change your password after login."
//        );

        return buildDoctorResponse(doctor);
    }

    public DoctorResponse updateDoctor(Long id, DoctorUpdateRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setSpecialization(request.getSpecialization());

        User user = doctor.getUser();
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        userRepository.save(user);
        Doctor updatedDoctor = doctorRepository.save(doctor);

        return buildDoctorResponse(updatedDoctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctorRepository.delete(doctor);
        userRepository.delete(doctor.getUser()); // optional: delete associated user too
    }

    public long getDoctorCount() {
        return doctorRepository.count();
    }


    private DoctorResponse buildDoctorResponse(Doctor doctor) {
        List<SlotInfo> availableSlots = slotRepository.findByDoctorAndIsBookedFalse(doctor)
                .stream()
                .map(slot -> new SlotInfo(slot.getId(), slot.getDate(), slot.getTime()))
                .collect(Collectors.toList());
        return DoctorResponse.builder()
                .id(doctor.getId())
                .name(doctor.getUser().getName())
                .email(doctor.getUser().getEmail())
                .phone(doctor.getUser().getPhone())
                .specialization(doctor.getSpecialization())
                .experience(doctor.getExperience())
                .licenseNumber(doctor.getLicenseNumber())
                .availableSlots(availableSlots)
                .build();
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::buildDoctorResponse)
                .collect(Collectors.toList());
    }


    private String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }



    public DoctorAppointmentResponse getTodayAppointmentsForDoctor(String doctorEmail) {
        // 1. Find the doctor
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 2. Get today's date
        LocalDate today = LocalDate.now();

        // 3. Find appointments through slots
        List<Slot> slots = slotRepository.findByDoctorAndDateAndAppointmentNotNull(doctor, today);

        // 4. Format the response
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

        List<DoctorAppointmentResponse.AppointmentInfo> appointmentInfos = slots.stream()
                .map(slot -> {
                    Appointment a = slot.getAppointment();
                    return new DoctorAppointmentResponse.AppointmentInfo(
                            slot.getTime().format(timeFormatter), // Get time from slot
                            a.getPatient().getUser().getName(),
                            a.getStatus()
                    );
                })
                .toList();

        return new DoctorAppointmentResponse(appointmentInfos.size(), appointmentInfos);
    }


    public void cancelAppointment(Long appointmentId, String doctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("Unauthorized to cancel this appointment");
        }

        appointment.setStatus(Status.CANCELLED);
        appointmentRepository.save(appointment);

        String userEmail = appointment.getUser().getEmail();
        String subject = "Your appointment has been cancelled";
        String body = "Dear " + appointment.getUser().getName() +
                ",\n\nYour appointment with Dr. " + appointment.getDoctor().getUser().getName() +
                " scheduled for " + appointment.getSlot().getDate() + " at " + appointment.getSlot().getTime() +
                " has been cancelled.\n\nRegards,\nClinicCare";

        emailService.sendEmail(userEmail, subject, body);
    }

    public void rescheduleAppointment(Long appointmentId, String newDateTime, String doctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("Unauthorized to reschedule this appointment");
        }

        LocalDateTime newDateTimeObj = LocalDateTime.parse(newDateTime);
        appointment.getSlot().setDate(newDateTimeObj.toLocalDate());
        appointment.getSlot().setTime(newDateTimeObj.toLocalTime());
        appointment.setStatus(Status.RESCHEDULED);

        appointmentRepository.save(appointment);

        String userEmail = appointment.getUser().getEmail();
        String subject = "Your appointment has been rescheduled";
        String body = "Dear " + appointment.getUser().getName() +
                ",\n\nYour appointment with Dr. " + appointment.getDoctor().getUser().getName() +
                " has been rescheduled to " + appointment.getSlot().getDate() + " at " + appointment.getSlot().getTime() +
                ".\n\nRegards,\nClinicCare";

        emailService.sendEmail(userEmail, subject, body);
    }
}
