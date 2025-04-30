package com.auth.controller;

import com.auth.dto.*;
import com.auth.model.User;
import com.auth.repository.UserRepository;
import com.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        // save the new user into the database and return the response

        authService.registerUser(request);
        return ResponseEntity.ok("User registered successsfully! Status: pending account");
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
}
