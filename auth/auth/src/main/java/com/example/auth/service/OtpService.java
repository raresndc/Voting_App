package com.example.auth.service;

import com.example.auth.entity.User;
import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private final UserService userService;
    private final Map<String, Integer> otpCache = new ConcurrentHashMap<>();
    private static final SecureRandom secureRandom =  new SecureRandom();

    public OtpService(UserService userService) {
        this.userService = userService;
    }

    public int generateOtp(String email) {
        int otp = secureRandom.nextInt(999999999);
        otpCache.put(email, otp);

        // Use an SMS/email service to send the OTP
        return otp;
    }

    public boolean validateOtp(String email, int otp) {
        Integer cachedOtp = otpCache.get(email); // Get cached OTP (Integer)

        if (cachedOtp != null && cachedOtp == otp) { // Direct comparison of int and Integer (unboxing)
            // Mark the user as validated in the database
            Optional<User> userOptional = userService.findUserByEmail(email);
            if (userOptional.isEmpty()) {
                // Create a new user if one doesn't exist
                User newUser = User.builder().email(email).isVerified(true).build();
                userService.saveUser(newUser);
            } else {
                // Update the existing user's validation status
                User existingUser = userOptional.get();
                existingUser.setVerified(true);
                userService.saveUser(existingUser);
            }
            // Remove OTP from cache after validation
            otpCache.remove(email);
            return true;
        }
        return false;
    }

}

