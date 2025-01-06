package com.example.auth.controller;

import com.example.auth.entity.User;
import com.example.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) {

        // Get the currently authenticated user's email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Find the user in the database
        User user = userService.findUserByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Check if the old password matches
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Old password is incorrect");
        }

        // Validate the new password (optional: add custom validation logic)
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be empty");
        }
        if (newPassword.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password must be at least 8 characters long");
        }

        // Hash the new password and save it
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.saveUser(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/change-passcode")
    public ResponseEntity<?> changePasscode(
            @RequestParam("oldPasscode") String oldPasscode,
            @RequestParam("newPasscode") String newPasscode) {

        // Get the currently authenticated user's email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Find the user in the database
        User user = userService.findUserByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Check if the old password matches
        if (!passwordEncoder.matches(oldPasscode, user.getPasscode())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Old passcode is incorrect");
        }

        // Validate the new password (optional: add custom validation logic)
        if (newPasscode == null || newPasscode.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New passcode cannot be empty");
        }

        // Hash the new password and save it
        user.setPasscode(passwordEncoder.encode(newPasscode));
        userService.saveUser(user);

        return ResponseEntity.ok("Passcode changed successfully");
    }
}
