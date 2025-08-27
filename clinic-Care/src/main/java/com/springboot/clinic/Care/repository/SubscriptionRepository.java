package com.springboot.clinic.Care.repository;

import com.springboot.clinic.Care.model.Subscription;
import com.springboot.clinic.Care.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Subscription findByUser(User user);

    Optional<Subscription> findByUserId(Long userId);
}
