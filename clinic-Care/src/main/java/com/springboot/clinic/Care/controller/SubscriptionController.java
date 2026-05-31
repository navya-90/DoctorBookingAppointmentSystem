package com.springboot.clinic.Care.controller;

import com.springboot.clinic.Care.dto.SubscriptionResponse;
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

import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/user")
    public ResponseEntity<SubscriptionResponse> getUserSubscription() {
        User user = getCurrentUser();
        Subscription subscription = subscriptionService.getUserSubscription(user.getId());
        return ResponseEntity.ok(mapToSubscriptionResponse(subscription));
    }

    @PatchMapping("/upgrade")
    public ResponseEntity<SubscriptionResponse> upgradeUserSubscription(
            @RequestParam PlanType planType,
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId,
            @RequestParam(required = false, defaultValue = "") String paymentLinkReferenceId,
            @RequestParam String paymentLinkStatus,
            @RequestParam String signature
    ) {
        try {
            org.json.JSONObject options = new org.json.JSONObject();
            options.put("payment_link_id", paymentLinkId);
            options.put("payment_link_reference_id", paymentLinkReferenceId);
            options.put("payment_link_status", paymentLinkStatus);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isSignatureValid = com.razorpay.Utils.verifyPaymentLink(options, apiSecret);
            if (!isSignatureValid) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            User user = getCurrentUser();
            Subscription upgraded = subscriptionService.upgradeSubscription(user.getId(), planType);
            return ResponseEntity.ok(mapToSubscriptionResponse(upgraded));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    private SubscriptionResponse mapToSubscriptionResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .planType(subscription.getPlanType())
                .isValid(subscription.isValid())
                .build();
    }
}
