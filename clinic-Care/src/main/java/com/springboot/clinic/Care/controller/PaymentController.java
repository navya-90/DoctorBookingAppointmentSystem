package com.springboot.clinic.Care.controller;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.springboot.clinic.Care.dto.PaymentLinkResponse;
import com.springboot.clinic.Care.model.PlanType;
import com.springboot.clinic.Care.model.User;
import com.springboot.clinic.Care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final UserRepository userRepository;

    @Value("${razorpay.api.key}")
    private  String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    @PostMapping("/{planType}")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @PathVariable PlanType planType
    ) {
        try {
            // 1. Get the current authenticated user from SecurityContext
            User user = getCurrentUser();

            // 2. Calculate amount in paise (Razorpay uses paise)
            int baseAmount = 799 * 100; // Monthly cost in paise
            int amount = baseAmount;

            if (planType.equals(PlanType.ANNUALLY)) {
                amount = baseAmount * 12;
                amount = (int) (amount * 0.7); // Apply 30% discount
            }

            // 3. Initialize Razorpay client
            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

            // 4. Prepare payment link request
            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", amount);
            paymentLinkRequest.put("currency", "INR");
            paymentLinkRequest.put("callback_url", "http://localhost:5173/upgrade_plan/success?planType=" + planType);
            paymentLinkRequest.put("callback_method", "get");

            JSONObject customer = new JSONObject();
            customer.put("name", user.getName());
            customer.put("email", user.getEmail());
            paymentLinkRequest.put("customer", customer);

            // 5. Create payment link
            PaymentLink paymentLink = razorpay.paymentLink.create(paymentLinkRequest);

            // 6. Extract and return response
            String paymentLinkId = paymentLink.get("id");
            String paymentLinkUrl = paymentLink.get("short_url");

            PaymentLinkResponse res = new PaymentLinkResponse();
            res.setPayment_link_id(paymentLinkId);
            res.setPayment_link_url(paymentLinkUrl);

            return new ResponseEntity<>(res, HttpStatus.CREATED);

        } catch (RazorpayException e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}
