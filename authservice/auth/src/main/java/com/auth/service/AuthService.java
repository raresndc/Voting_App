package com.auth.service;

import com.auth.dto.LoginRequest;
import com.auth.dto.RefreshTokenRequest;
import com.auth.dto.RegisterRequest;
import com.auth.dto.TokenPair;
import com.auth.model.User;
import com.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private UserDetailsService userDetailsService;

    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        // check if user with the same username already exists

        if(userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }

        User user = User
                .builder()
                .fullName(registerRequest.getFullName())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .build();

        userRepository.save(user);
    }

    public TokenPair login(LoginRequest loginRequest) {
        // auth the user

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // set auth in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // generate token pair
        return jwtService.generateTokenPair(authentication);
    }

    public TokenPair refreshToken(RefreshTokenRequest request) {
        // check if it is a valid refresh token

        String refreshToken = request.getRefreshToken();

        if(!jwtService.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String user = jwtService.extractUsernameFromToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user);

        if (userDetails == null) {
            throw new IllegalArgumentException("User not found");
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        String accessToken = jwtService.generateAccessToken(authentication);
        return new TokenPair(accessToken, refreshToken);
    }
}
