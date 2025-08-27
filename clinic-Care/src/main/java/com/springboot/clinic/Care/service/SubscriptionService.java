package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.model.PlanType;
import com.springboot.clinic.Care.model.Subscription;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.repository.AppointmentRepository;
import com.springboot.clinic.Care.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final AppointmentRepository appointmentRepository;

    public Subscription createSubscription(User user) {
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusMonths(12)); // 1 year for free plan
        subscription.setPlanType(PlanType.FREE);
        subscription.setValid(true);
        return subscriptionRepository.save(subscription);
    }

    public Subscription getUserSubscription(Long userId) {
        return subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found for user: " + userId));
    }

    public Subscription upgradeSubscription(Long userId, PlanType planType) {
        Subscription subscription = getUserSubscription(userId);
        subscription.setPlanType(planType);
        subscription.setStartDate(LocalDate.now());

        if (planType == PlanType.ANNUALLY) {
            subscription.setEndDate(LocalDate.now().plusMonths(12));
        } else {
            subscription.setEndDate(LocalDate.now().plusMonths(1));
        }

        subscription.setValid(true);
        return subscriptionRepository.save(subscription);
    }

    public boolean isValid(Subscription subscription, User user) {
        if (subscription == null) return false;

        // Auto-revert to free plan if paid subscription expires
        if (isExpired(subscription) && subscription.getPlanType() != PlanType.FREE) {
            revertToFreePlan(user);
            subscription = getUserSubscription(user.getId()); // Refresh subscription
        }

        // Free plan: Check lifetime free appointments (not monthly)
        if (subscription.getPlanType() == PlanType.FREE) {
            long totalFreeAppointments = appointmentRepository.countByUserAndPaymentDone(user, true);
            return totalFreeAppointments < 3; // Allow only 3 free appointments ever
        }

        // Paid plan: Check expiry
        return !subscription.getEndDate().isBefore(LocalDate.now());
    }

    public boolean isExpired(Subscription subscription) {
        return subscription.getEndDate().isBefore(LocalDate.now());
    }

    public void revertToFreePlan(User user) {
        Subscription current = getUserSubscription(user.getId());
        current.setPlanType(PlanType.FREE);
        current.setStartDate(LocalDate.now());
        current.setEndDate(LocalDate.now().plusYears(10)); // Long duration for free plan
        current.setValid(true);
        subscriptionRepository.save(current);
    }
}
