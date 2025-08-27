package com.springboot.clinic.Care.repository;

import com.springboot.clinic.Care.model.Patient;
import com.springboot.clinic.Care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser(User user);
}
