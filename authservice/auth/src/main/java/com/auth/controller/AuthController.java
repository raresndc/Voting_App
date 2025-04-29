package com.auth.controller;

import com.auth.dto.LoginRequest;
import com.auth.dto.RefreshTokenRequest;
import com.auth.dto.RegisterRequest;
import com.auth.dto.TokenPair;
import com.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        // save the new user into the database and return the response

        authService.registerUser(request);
        return ResponseEntity.ok("User registered successsfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        // auth the user
        // return access + refresh token
        TokenPair tokenPair = authService.login(loginRequest);
        return ResponseEntity.ok(tokenPair);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        TokenPair tokenPair = authService.refreshToken(request);
        return ResponseEntity.ok(tokenPair);
    }
}
