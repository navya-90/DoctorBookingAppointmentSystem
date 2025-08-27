package com.springboot.clinic.Care.repository;

import com.springboot.clinic.Care.model.Doctor;
import com.springboot.clinic.Care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);

    Optional<Doctor> findByUserEmail(String doctorEmail);

    Optional<Doctor> findByUser(User user);

    @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a WHERE a.doctor.id = :doctorId")
    long countDistinctPatientsByDoctorId(Long doctorId);
}
