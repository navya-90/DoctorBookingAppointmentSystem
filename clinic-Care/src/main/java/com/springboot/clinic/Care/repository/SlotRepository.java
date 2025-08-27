package com.springboot.clinic.Care.repository;

import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.model.Slot;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByDoctorAndIsBookedFalse(Doctor doctor);
    List<Slot> findByDoctorAndDate(Doctor doctor, LocalDate date);
    boolean existsByDoctorAndDateAndTime(Doctor doctor, LocalDate date, java.time.LocalTime time);

    List<Slot> findByDoctorAndDateAndAppointmentNotNull(Doctor doctor, LocalDate today);
    ;

    List<Slot> findByDoctorAndDateAfterOrDateEquals(Doctor doctor, LocalDate now, LocalDate now1);

    List<Slot> findByDoctorAndDateGreaterThanEqualAndIsBookedFalse(Doctor doctor, LocalDate now);

    Page<Slot> findByDoctorIdAndAppointmentIsNullAndDateGreaterThanEqual(Long doctorId, LocalDate today, Pageable pageable);

    @Query("SELECT MAX(s.date) FROM Slot s WHERE s.doctor = :doctor")
    Optional<LocalDate> findLastDateByDoctor(@Param("doctor") Doctor doctor);
}
