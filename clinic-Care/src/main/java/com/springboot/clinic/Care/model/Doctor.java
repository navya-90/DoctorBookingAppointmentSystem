package com.springboot.clinic.Care.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialization;
    private int experience;
    private String licenseNumber;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Slot> availableSlots = new ArrayList<>();
    // Example: ["10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"]

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}

