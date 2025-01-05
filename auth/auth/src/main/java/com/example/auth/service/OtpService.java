package com.example.auth.service;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpCache.put(email, otp);

        // Use an SMS/email service to send the OTP
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        return otp.equals(otpCache.get(email));
    }
}

