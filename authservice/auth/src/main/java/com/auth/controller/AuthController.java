package com.auth.controller;

import com.auth.dto.*;
import com.auth.model.Role;
import com.auth.model.SuperUser;
import com.auth.model.User;
import com.auth.repository.CandidateRepository;
import com.auth.repository.RoleRepository;
import com.auth.repository.SuperUserRepository;
import com.auth.repository.UserRepository;
import com.auth.service.AuthService;
import com.auth.service.JwtService;
import com.auth.service.SuperAdminService;
import com.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SuperAdminService superAdminService;

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SuperUserRepository superUserRepository;

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

//    @PreAuthorize("hasRole('SUPER_USER') or hasRole('SUPER_ADMIN')")
//    @PostMapping("/register-candidate")
//    public ResponseEntity<String> registerCandidate(@RequestBody @Valid RegisterCandidateRequest request) {
//
//        authService.registerCandidate(request);
//        return ResponseEntity.ok("Candidate registered successfully! Status: pending account");
//    }

//    @PostMapping("/login-super-admin")
//    public ResponseEntity<?> loginSuperAdmin(
//            @Valid @RequestBody SuperAdminLoginRequest req
//    ) {
//        return superAdminService.findByUsername(req.getUsername())
//                .map(sa -> {
//                    // 1) Verify password against stored hash
//                    if (!passwordEncoder.matches(req.getPassword(), sa.getPasswordHash())) {
//                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                                .body(Map.of("error", "Invalid credentials"));
//                    }
//                    // 2) Verify secret key against stored hash
//                    if (!superAdminService.verifySecret(sa.getId(), req.getSecretKey())) {
//                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                                .body(Map.of("error", "Invalid super-admin secret key"));
//                    }
//                    // 3) Build a UserDetails principal for Spring Security
//                    GrantedAuthority authRole = new SimpleGrantedAuthority("ROLE_SUPER_ADMIN");
//                    UserDetails principal = org.springframework.security.core.userdetails.User
//                            .withUsername(sa.getUsername())
//                            .password(sa.getPasswordHash())
//                            .authorities(authRole)
//                            .accountExpired(false)
//                            .accountLocked(false)
//                            .credentialsExpired(false)
//                            .disabled(false)
//                            .build();
//                    Authentication auth = new UsernamePasswordAuthenticationToken(
//                            principal, null, principal.getAuthorities()
//                    );
//                    SecurityContextHolder.getContext().setAuthentication(auth);
//
//                    // 4) Issue JWT pair
//                    TokenPair tokens = authService.issueTokenPair(auth);
//                    return ResponseEntity.ok(Map.of(
//                            "accessToken",  tokens.getAccessToken(),
//                            "refreshToken", tokens.getRefreshToken(),
//                            "username",     principal.getUsername(),
//                            "role",         authRole.getAuthority()
//                    ));
//                })
//                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("error", "Super-admin not found")));
//    }

    @PostMapping("/login-super-admin")
    public ResponseEntity<UserInfoDto> loginSuperAdmin(
            @RequestBody SuperAdminLoginRequest req,
            HttpServletResponse response
    ) {
        // delegate to your existing SuperAdminService for credentials + secret
        Authentication auth = superAdminService.authenticate(req);

        SecurityContextHolder.getContext().setAuthentication(auth);
        TokenPair tokens = authService.issueTokenPair(auth);

        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", tokens.getAccessToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
//                .domain("e-vote.ro")
                .maxAge(jwtService.getExpirySeconds())
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // build a User or DTO from the SuperAdmin principal
        UserInfoDto dto = superAdminService.buildUserInfoDto(auth.getName());
        return ResponseEntity.ok(dto);
    }

//    @PostMapping("/register-super-admin")
//    public ResponseEntity<String> registerSuperAdmin(@RequestBody @Valid RegisterRequest registerRequest) {
//        // Check if the super admin already exists by username or email (you can add more checks as needed)
//        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
//            return ResponseEntity.badRequest().body("Username is already taken");
//        }
//
//        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body("Email is already registered");
//        }
//
//        // Fetch the SUPER_ADMIN role from the Role repository
//        Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN")
//                .orElseThrow(() -> new RuntimeException("Super Admin role not found"));
//
//        // Map the RegisterRequest to a User entity
//        User superAdmin = new User(
//                registerRequest.getFirstName().toUpperCase(),
//                registerRequest.getLastName().toUpperCase(),
//                registerRequest.getUsername(),
//                passwordEncoder.encode(registerRequest.getPassword()),
//                superAdminRole, // Assign the SUPER_ADMIN role
//                registerRequest.getPhoneNo(),
//                registerRequest.getGender(),
//                registerRequest.getEmail(),
//                registerRequest.getPersonalIdNo(),
//                registerRequest.getCitizenship(),
//                registerRequest.getCountry(),
//                registerRequest.getCounty(),
//                registerRequest.getCity(),
//                registerRequest.getAddress(),
//                registerRequest.getDob(),
//                registerRequest.getAge(),
//                true // Verified by default for super admin
//        );
//
//        // Save the super admin user to the database
//        userRepository.save(superAdmin);
//
//        return ResponseEntity.ok("Super Admin registered successfully");
//    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
//        // auth the user
//        // return access + refresh token
//        TokenPair tokenPair = authService.login(loginRequest);
//        return ResponseEntity.ok(tokenPair);
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req,
                                   HttpServletResponse response) {
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
        // 1) Create access‐cookie
        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", tokens.getAccessToken())
                .httpOnly(true)
                .secure(false)              // in prod: only send over HTTPS
                .path("/")
//                .domain("e-vote.ro")       // lock to your domain
                .maxAge(jwtService.getExpirySeconds())
                .sameSite("Strict")        // prevent CSRF
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 2) (Optionally) issue a refresh cookie here, too
        // …

        // 3) Return user info but *not* the raw tokens
        return ResponseEntity.ok(UserInfoDto.from(user));
    }

//    @PostMapping("/login-super-user")
//    public ResponseEntity<?> loginSuperUser(
//            @Valid @RequestBody LoginRequest req) {
//        // 1) Lookup the SuperUser entity
//        SuperUser su = superUserRepository.findByUsername(req.getUsername())
//                .orElseThrow(() -> new UsernameNotFoundException("Super-user not found"));
//
//        // 2) Check password yourself
//        if (!passwordEncoder.matches(req.getPassword(), su.getPassword())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("error", "Invalid credentials"));
//        }
//
//        // 3) Build a Spring Security principal
//        GrantedAuthority authRole = new SimpleGrantedAuthority(su.getRole().getName());
//        UserDetails principal = org.springframework.security.core.userdetails.User
//                .withUsername(su.getUsername())
//                .password(su.getPassword())
//                .authorities(authRole)
//                .accountExpired(false)
//                .accountLocked(false)
//                .credentialsExpired(false)
//                .build();
//
//        // 4) Populate the SecurityContext
//        Authentication auth = new UsernamePasswordAuthenticationToken(
//                principal, null, principal.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(auth);
//
//        // 5) Issue tokens
//        TokenPair tokens = authService.issueTokenPair(auth);
//
//        // 6) Return the same map shape as your other logins
//        return ResponseEntity.ok(Map.of(
//                "accessToken",  tokens.getAccessToken(),
//                "refreshToken", tokens.getRefreshToken(),
//                "username",     su.getUsername(),
//                "role",         su.getRole().getName()
//        ));
//    }

    @PostMapping("/login-super-user")
    public ResponseEntity<UserInfoDto> loginSuperUser(
            @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {
        // 1) Lookup SuperUser
        SuperUser su = superUserRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Super-user not found"));

        // 2) Verify password
        if (!passwordEncoder.matches(req.getPassword(), su.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3) Build Authentication and context
        Authentication auth = new UsernamePasswordAuthenticationToken(
                su.getUsername(),
                null,
                List.of(new SimpleGrantedAuthority(su.getRole().getName()))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        // 4) Issue tokens
        TokenPair tokens = authService.issueTokenPair(auth);

        // 5) Set cookie
        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", tokens.getAccessToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
//                .domain("e-vote.ro")
                .maxAge(jwtService.getExpirySeconds())
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 6) You may need to map SuperUser → User to populate all DTO fields
        User dummy = new User(
                su.getUsername(),
                su.getEmail()
        );
        return ResponseEntity.ok(UserInfoDto.from(dummy));
    }


//    @PostMapping("/refresh-token")
//    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
//        TokenPair tokenPair = authService.refreshToken(request);
//        return ResponseEntity.ok(tokenPair);
//    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Void> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // 1) Extract the raw refresh token from header or cookie
        String rawRefresh = jwtService.resolveRefreshToken(request);

        // 2) Wrap it in your DTO
        RefreshTokenRequest dto = new RefreshTokenRequest();
        dto.setRefreshToken(rawRefresh);

        // 3) Delegate to the service
        TokenPair tokens = authService.refreshToken(dto);

        // 4) Issue a new access-token cookie
        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", tokens.getAccessToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
//                .domain("e-vote.ro")
                .maxAge(jwtService.getExpirySeconds())
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // (Optional) rotate & set a new REFRESH_TOKEN cookie here, if desired

        return ResponseEntity.ok().build();
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

//    @PostMapping("/2fa/confirm")
//    public ResponseEntity<?> confirm2FA(
//            @RequestBody Confirm2FARequest req
//    ) {
//        authService.confirm2FA(req.getUsername(), req.getCode());
//        return ResponseEntity.ok(Map.of("message","2FA enabled"));
//    }

    @PostMapping("/2fa/confirm")
    public ResponseEntity<UserInfoDto> confirm2FA(
            @RequestBody Confirm2FARequest req,
            HttpServletResponse response
    ) {
        // Enable 2FA and retrieve the updated User
        User user = authService.confirm2FA(req.getUsername(), req.getCode());

        // Issue new JWT cookie
        TokenPair tokens = authService.issueTokenPairForUser(user);
        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", tokens.getAccessToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
//                .domain("e-vote.ro")
                .maxAge(jwtService.getExpirySeconds())
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(UserInfoDto.from(user));
    }

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
//        authService.logout(request);
//        return ResponseEntity.ok("Logged out successfully!");
//    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie delete = ResponseCookie.from("JWT_TOKEN", "")
                .httpOnly(true).secure(false).path("/")
//                .domain("e-vote.ro")
                .maxAge(0).sameSite("Strict").build();
        response.addHeader(HttpHeaders.SET_COOKIE, delete.toString());
        return ResponseEntity.ok("Logged out");
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

    @GetMapping("/{username}")
    public ResponseEntity<UserInfoDto> getByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserInfoDto> profile(HttpServletRequest req) {
        // 1) extract raw token (header or cookie)
        String token = jwtService.resolveToken(req);   // implement this helper
        // 2) load user
        User u = jwtService.extractUserFromToken(token);
        return ResponseEntity.ok(UserInfoDto.from(u));
    }
}
