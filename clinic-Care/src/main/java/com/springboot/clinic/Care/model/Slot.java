package com.springboot.clinic.Care.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;      // e.g., 2025-07-20
    private LocalTime time;      // e.g., 10:30

    private boolean isBooked;    // true if already booked

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne(mappedBy = "slot", cascade = CascadeType.ALL)
    private Appointment appointment;
}
