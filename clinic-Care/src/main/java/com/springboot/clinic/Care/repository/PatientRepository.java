package com.springboot.clinic.Care.repository;

import com.springboot.clinic.Care.model.Patient;
import com.springboot.clinic.Care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    java.util.List<Patient> findByUser(User user);
    Optional<Patient> findFirstByUserOrderByIdDesc(User user);
    Optional<Patient> findByUserAndNameAndAgeAndGender(User user, String name, int age, String gender);
}
