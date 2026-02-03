package com.springboot.clinic.Care.service;

public interface EmailService {

    void sendEmail(String to, String subject, String body);
}
