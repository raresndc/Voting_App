package com.example.auth.controller;

import com.example.auth.entity.User;
import com.example.auth.service.*;
import com.example.auth.util.JwtUtil;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final UserService userService;
    private final FileService fileService;
    private final OtpService otpService;
    private final SMSSenderService smsSenderService;
    private final EmailSenderService emailSenderService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, FileService fileService, OtpService otpService, SMSSenderService smsSenderService, EmailSenderService emailSenderService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.fileService = fileService;
        this.otpService = otpService;
        this.smsSenderService = smsSenderService;
        this.emailSenderService = emailSenderService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/validate-email")
    public ResponseEntity<?> validateEmail(
            @RequestParam("email") String toEmail,
            @RequestParam(value = "otp", required = false) Integer otp) throws MessagingException {
        Optional<User> existingUser = userService.findUserByEmail(toEmail);

        if (existingUser.isPresent() && otp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists in the system");
        }

        if (otp == null) {
            int generatedOtp = otpService.generateOtp(toEmail);
            log.info("OTP generated for email: {}", toEmail);

            emailSenderService.sendOtp(toEmail, generatedOtp);
            return ResponseEntity.ok("OTP sent to " + toEmail);
        } else {
            boolean isValid = otpService.validateOtp(toEmail, otp);
            if (isValid) {
                String token = jwtUtil.generateToken(toEmail); // Generate JWT
                return ResponseEntity.ok(Map.of("message", "Email validated successfully", "token", token));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
            }
        }
    }

    @PostMapping("/personal-info")
    public ResponseEntity<?> submitPersonalInfo(@RequestBody User user) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // Get authenticated email
        Optional<User> existingUser = userService.findUserByEmail(email);

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not validated");
        }

        User existing = existingUser.get();

        // Validate the password field
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be null or empty");
        }

        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setPhoneNumber(user.getPhoneNumber());
        existing.setAddress(user.getAddress());
        existing.setDateOfBirth(user.getDateOfBirth());

        // Hash the password before saving
        existing.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(existing);

        return ResponseEntity.ok("Personal information submitted successfully");
    }



    @PostMapping(value = "/verify-identity")
    public ResponseEntity<?> verifyIdentity(
            @RequestParam("email") String email,
            @RequestPart(value = "governmentId", required = true) MultipartFile governmentId,
            @RequestPart(value = "selfie", required = true) MultipartFile selfie) {
        // Ensure user exists and has submitted personal info
        Optional<User> userOptional = userService.findUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        try {
            // Save uploaded files
            String govIdPath = fileService.saveGovernmentId(governmentId);
            String selfiePath = fileService.saveSelfie(selfie);

            // Mark user as verified
            User user = userOptional.get();
            user.setVerified(true);
            userService.saveUser(user);

            return ResponseEntity.ok("Identity verified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during verification: " + e.getMessage());
        }
    }


    @PostMapping("/set-passcode")
    public ResponseEntity<?> setPasscode(@RequestBody User user) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // Get authenticated email
        Optional<User> existingUser = userService.findUserByEmail(email);

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not validated");
        }

        User existing = existingUser.get();

        existing.setPasscode(user.getPasscode());
        userService.saveUser(existing);

        return ResponseEntity.ok("Passcode set successfully");
    }

}
