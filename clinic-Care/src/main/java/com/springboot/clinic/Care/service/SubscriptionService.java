package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.model.PlanType;
import com.springboot.clinic.Care.model.Subscription;
import com.springboot.clinic.Care.model.User;

public interface SubscriptionService {

    Subscription createSubscription(User user);

    Subscription getUserSubscription(Long userId);

    Subscription upgradeSubscription(Long userId, PlanType planType);

    boolean isValid(Subscription subscription, User user);

    boolean isExpired(Subscription subscription);

    void revertToFreePlan(User user);
}
