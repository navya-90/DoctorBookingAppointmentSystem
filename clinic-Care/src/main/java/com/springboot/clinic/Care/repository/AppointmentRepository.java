package com.springboot.clinic.Care.repository;

import com.springboot.clinic.Care.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    long countByUserAndPaymentDone(User user, boolean b);

    long countBySlot_Date(LocalDate today);
}
