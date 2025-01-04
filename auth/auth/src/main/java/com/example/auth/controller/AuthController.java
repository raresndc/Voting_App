package com.example.auth.controller;

import com.example.auth.entity.User;
import com.example.auth.service.OtpService;
import com.example.auth.service.UserService;
import com.example.auth.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final FileService fileService;
    private final OtpService otpService;

    @Autowired
    public AuthController(UserService userService, FileService fileService, OtpService otpService) {
        this.userService = userService;
        this.fileService = fileService;
        this.otpService = otpService;
    }

    @PostMapping("/validate-phone")
    public ResponseEntity<?> validatePhone(
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam(value = "otp", required = false) String otp) {
        if (otp == null) {
            // Generate OTP
            String generatedOtp = otpService.generateOtp(phoneNumber);
            // Send OTP


            return ResponseEntity.ok("OTP " + generatedOtp + " sent to " + phoneNumber);
        } else {
            // Validate OTP
            boolean isValid = otpService.validateOtp(phoneNumber, otp);
            if (isValid) {
                return ResponseEntity.ok("Phone number validated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
            }
        }
    }

    @PostMapping("/personal-info")
    public ResponseEntity<?> submitPersonalInfo(@RequestBody User user) {
        // Ensure phone number is already validated
        Optional<User> existingUser = userService.findUserByPhoneNumber(user.getPhoneNumber());
        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Phone number not validated");
        }

        User existing = existingUser.get();
        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setAddress(user.getAddress());
        existing.setDateOfBirth(user.getDateOfBirth());
        userService.saveUser(existing);

        return ResponseEntity.ok("Personal information submitted successfully");
    }

    @PostMapping("/verify-identity")
    public ResponseEntity<?> verifyIdentity(
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("governmentId") MultipartFile governmentId,
            @RequestParam("selfie") MultipartFile selfie) {
        // Ensure user exists and has submitted personal info
        Optional<User> userOptional = userService.findUserByPhoneNumber(phoneNumber);
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

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        userService.saveUser(user);
//
//        //create otp and send it to the user + i should have three apis here: 1. phone number + otp confirmation;
//        //2.personal info
//        //3.identity
//
//        return ResponseEntity.ok("User registered successfully");
//    }
//
//    @PostMapping("/upload")
//    public ResponseEntity<?> uploadDocuments(
//            @RequestParam("governmentId") MultipartFile governmentId,
//            @RequestParam("selfie") MultipartFile selfie) {
//        try {
//            String govIdPath = fileService.saveGovernmentId(governmentId);
//            String selfiePath = fileService.saveSelfie(selfie);
//            return ResponseEntity.ok("Documents uploaded successfully:\n" +
//                    "Government ID: " + govIdPath + "\n" +
//                    "Selfie: " + selfiePath);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Error uploading files: " + e.getMessage());
//        }
//    }
}
