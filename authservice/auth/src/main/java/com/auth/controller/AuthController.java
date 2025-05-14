package com.auth.controller;

import com.auth.dto.*;
import com.auth.model.Role;
import com.auth.model.User;
import com.auth.repository.CandidateRepository;
import com.auth.repository.RoleRepository;
import com.auth.repository.UserRepository;
import com.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CandidateRepository candidateRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        // save the new user into the database and return the response

        authService.registerUser(request);
        return ResponseEntity.ok("User registered successsfully! Status: pending account");
    }

    @PreAuthorize("hasRole('SUPER_USER') or hasRole('SUPER_ADMIN')")
    @PostMapping("/register-candidate")
    public ResponseEntity<String> registerCandidate(@RequestBody @Valid RegisterCandidateRequest request) {

        authService.registerCandidate(request);
        return ResponseEntity.ok("Candidate registered successfully! Status: pending account");
    }

    @PostMapping("/register-super-admin")
    public ResponseEntity<String> registerSuperAdmin(@RequestBody @Valid RegisterRequest registerRequest) {
        // Check if the super admin already exists by username or email (you can add more checks as needed)
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        // Fetch the SUPER_ADMIN role from the Role repository
        Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN")
                .orElseThrow(() -> new RuntimeException("Super Admin role not found"));

        // Map the RegisterRequest to a User entity
        User superAdmin = new User(
                registerRequest.getFullName(),
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                superAdminRole, // Assign the SUPER_ADMIN role
                registerRequest.getPhoneNo(),
                registerRequest.getGender(),
                registerRequest.getEmail(),
                registerRequest.getPersonalIdNo(),
                registerRequest.getCitizenship(),
                registerRequest.getCountry(),
                registerRequest.getCounty(),
                registerRequest.getCity(),
                registerRequest.getAddress(),
                registerRequest.getDob(),
                registerRequest.getAge(),
                true // Verified by default for super admin
        );

        // Save the super admin user to the database
        userRepository.save(superAdmin);

        return ResponseEntity.ok("Super Admin registered successfully");
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
//        // auth the user
//        // return access + refresh token
//        TokenPair tokenPair = authService.login(loginRequest);
//        return ResponseEntity.ok(tokenPair);
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // 1) Authenticate username + password
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getUsername(),
                        req.getPassword()
                )
        );
        // 2) Lookup the user to check 2FA
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.isTwoFactorEnabled()) {
            // 3a) 2FA is ON → ask client to submit TOTP/OTP
            return ResponseEntity.ok(Map.of("needs2fa", true));
        }

        SecurityContextHolder.getContext().setAuthentication(auth);
        TokenPair tokens = authService.issueTokenPair(auth);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/2fa/auth")
    public ResponseEntity<TokenPair> loginWith2fa(@RequestBody TwoFaLoginRequest req) {
        TokenPair tokens = authService.loginWith2FA(
                req.getUsername(),
                req.getPassword(),
                req.getCode()
        );
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        TokenPair tokenPair = authService.refreshToken(request);
        return ResponseEntity.ok(tokenPair);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@Valid @RequestBody VerifyRequest request) {
        authService.verifyUser(request);
        return ResponseEntity.ok("User verified successfully! Status changed to verified account");
    }

    @PostMapping("/verify-candidate")
    public ResponseEntity<?> verifyCandidate(@Valid @RequestBody VerifyRequest request) {
        authService.verifyCandidate(request);
        return ResponseEntity.ok("Candidate verified successfully! Status changed to verified account");
    }

    @PostMapping("/2fa/setup")
    public ResponseEntity<Setup2FAResponse> setup2FA(@RequestParam String username) {
        // generates secret + provisioning URI
        return ResponseEntity.ok(authService.generate2FASetup(username));
    }

    @PostMapping("/2fa/confirm")
    public ResponseEntity<?> confirm2FA(
            @RequestBody Confirm2FARequest req
    ) {
        authService.confirm2FA(req.getUsername(), req.getCode());
        return ResponseEntity.ok(Map.of("message","2FA enabled"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);
        return ResponseEntity.ok("Logged out successfully!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok("Your password has been reset successfully.");
    }
}
