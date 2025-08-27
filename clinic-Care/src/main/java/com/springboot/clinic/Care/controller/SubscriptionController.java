package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.model.PlanType;
import com.springboot.clinic.Care.model.Subscription;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.repository.UserRepository;
import com.springboot.clinic.Care.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/user")
    public ResponseEntity<Subscription> getUserSubscription() {
        User user = getCurrentUser();
        Subscription subscription = subscriptionService.getUserSubscription(user.getId());
        return ResponseEntity.ok(subscription);
    }

    @PatchMapping("/upgrade")
    public ResponseEntity<Subscription> upgradeUserSubscription(@RequestParam PlanType planType) {
        User user = getCurrentUser();
        Subscription upgraded = subscriptionService.upgradeSubscription(user.getId(), planType);
        return ResponseEntity.ok(upgraded);
    }
}
