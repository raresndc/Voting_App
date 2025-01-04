package com.example.auth.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public String generateOtp(String phoneNumber) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpCache.put(phoneNumber, otp);
        // Use an SMS/email service to send the OTP
        return otp;
    }

    public boolean validateOtp(String phoneNumber, String otp) {
        return otp.equals(otpCache.get(phoneNumber));
    }
}

