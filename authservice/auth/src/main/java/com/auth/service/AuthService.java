package com.auth.service;

import com.auth.audit.dto.Auditable;
import com.auth.dto.*;
import com.auth.model.Role;
import com.auth.model.User;
import com.auth.repository.RoleRepository;
import com.auth.repository.UserRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private UserDetailsService userDetailsService;
    private EmailService emailService;
    private final RoleRepository roleRepository;
    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();

    @Auditable(action="REGISTER", targetType="User", targetIdArg="username")
    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        // check if user with the same username already exists

        if(userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        if (userRepository.existsByPersonalIdNo(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Personal Id Number already exists!");
        }

        if (userRepository.existsByPhoneNo(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Phone number already exists!");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User role not found"));

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(userRole)
                .phoneNo(registerRequest.getPhoneNo())
                .gender(registerRequest.getGender())
                .email(registerRequest.getEmail())
                .personalIdNo(registerRequest.getPersonalIdNo())
                .citizenship(registerRequest.getCitizenship())
                .country(registerRequest.getCountry())
                .county(registerRequest.getCounty())
                .city(registerRequest.getCity())
                .address(registerRequest.getAddress())
                .dob(registerRequest.getDob())
                .age(calculateAge(registerRequest.getDob()))
                .build();

        userRepository.save(user);

//        String subject = "Account Created Successfully";
//        String body = "Dear " + user.getFullName() + ",\n\nYour account has been successfully created in our system. Welcome!";
        SecureRandom secureRandom = new SecureRandom();
// produces a number from 0 to 9999, then pads to 4 digits (0000–9999)
        String code = String.format("%04d", secureRandom.nextInt(10_000));
        user.setVerificationCode(code);
        user.setVerificationExpiryDate(LocalDateTime.now().plusHours(1));

        userRepository.save(user);

        // send code
        emailService.sendVerificationEmail(user.getEmail(), code);
    }

    @Auditable(action="VERIFY", targetType="User", targetIdArg="username")
    @Transactional
    public void verifyUser(VerifyRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.isVerified()) {
            throw new IllegalStateException("Account already verified");
        }
        if (!request.getVerificationCode().equals(user.getVerificationCode())) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        if (user.getVerificationExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code expired");
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        user.setVerificationExpiryDate(null);
        userRepository.save(user);

        // send completion email
        String subject = "Registration Completed";
        String body = "Dear " + user.getFullName() + ",\n\nYour account has been successfully verified. Welcome!";
        emailService.sendEmail(user.getEmail(), subject, body);
    }


    private int calculateAge(LocalDate dob) {
        return Period.between(dob, LocalDate.now()).getYears();
    }

    @Auditable(action="LOGIN", targetType="User", targetIdArg="username")
    public TokenPair login(LoginRequest loginRequest) {

        // ensure user exists and is verified
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!user.isVerified()) {
            throw new IllegalStateException("Account not verified. Please check your email.");
        }

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

    @Auditable(action="REFRESH_TOKEN", targetType="User", targetIdArg="username")
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

    @Auditable(action="GENERATE_2FA_SETUP", targetType="User", targetIdArg="username")
    public Setup2FAResponse generate2FASetup(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user"));
        GoogleAuthenticatorKey key = gAuth.createCredentials();
        String secret = key.getKey();
        String otpAuthUrl = GoogleAuthenticatorQRGenerator
                .getOtpAuthURL("YourAppName", username, key);

        user.setTwoFactorSecret(secret);
        userRepository.save(user);

        return new Setup2FAResponse(secret, otpAuthUrl);
    }

    // 2) Confirm the code & enable
    @Auditable(action="CONFIRM_2FA", targetType="User", targetIdArg="username")
    public void confirm2FA(String username, int code) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user"));
        if (!gAuth.authorize(user.getTwoFactorSecret(), code)) {
            throw new IllegalArgumentException("Invalid 2FA code");
        }
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    // 3) During login, verify TOTP
    @Auditable(action="LOGIN_WITH_2FA", targetType="User", targetIdArg="username")
    public TokenPair loginWith2FA(String username, String rawPassword, int code) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user"));

        if (!user.isTwoFactorEnabled() ||
                !gAuth.authorize(user.getTwoFactorSecret(), code)) {
            throw new IllegalArgumentException("Invalid 2FA code");
        }

        // re-authenticate username+password
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, rawPassword)
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        return jwtService.generateTokenPair(auth);
    }

    /**
     * Issue a JWT pair from an already‐authenticated Authentication object.
     */
    public TokenPair issueTokenPair(Authentication authentication) {
        return jwtService.generateTokenPair(authentication);
    }

}
