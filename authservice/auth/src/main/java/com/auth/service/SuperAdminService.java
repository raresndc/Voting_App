package com.auth.service;

import com.auth.dto.CreateSuperAdminRequest;
import com.auth.dto.SuperAdminLoginRequest;
import com.auth.dto.UserInfoDto;
import com.auth.model.Role;
import com.auth.model.SuperAdmin;
import com.auth.model.User;
import com.auth.repository.RoleRepository;
import com.auth.repository.SuperAdminRepository;
import com.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class SuperAdminService {
    private final UserRepository userRepo;
    private final SuperAdminRepository superAdminRepo;
    private final PasswordEncoder hasher;
    private final SecureRandom rng;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    public SuperAdminService(UserRepository userRepo,
                             SuperAdminRepository superAdminRepo,
                             PasswordEncoder hasher) {
        this.userRepo       = userRepo;
        this.superAdminRepo = superAdminRepo;
        this.hasher         = hasher;
        this.rng            = new SecureRandom();
    }

    @Transactional
    public String provisionSuperAdmin(CreateSuperAdminRequest req) {
        Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN")
                .orElseThrow(() -> new RuntimeException("Super Admin role not found"));

        // 1) Prevent more than one
        if (superAdminRepo.count() > 0) {
            throw new IllegalStateException("A SuperAdmin already exists");
        }

        // 3) Generate & hash the super-admin secretKey
        byte[] bytes = new byte[32];
        rng.nextBytes(bytes);
        String rawSecret = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        String secretHash = hasher.encode(rawSecret);

        // 4) Persist the SuperAdmin subclass
        SuperAdmin sa = new SuperAdmin();
        sa.setUsername(req.getUsername());
        sa.setPasswordHash(hasher.encode(req.getRawPassword()));
        sa.setEmail(req.getEmail());
        sa.setSecretKeyHash(secretHash);
        sa.setAuditLevel(req.getAuditLevel());
        sa.setRole(superAdminRole);
        superAdminRepo.save(sa);

        // 5) Return the ONE-TIME secret for admin to record
        return rawSecret;
    }

    public long countSuperAdmins() {
        return superAdminRepo.count();
    }

    public boolean verifySecret(Long userId, String rawSecret) {
        return superAdminRepo.findById(userId)
                .map(sa -> hasher.matches(rawSecret, sa.getSecretKeyHash()))
                .orElse(false);
    }

    public Optional<SuperAdmin> findByUsername(String username) {
        return superAdminRepo.findByUsername(username);
    }

    public Authentication authenticate(SuperAdminLoginRequest req) {
        SuperAdmin sa = superAdminRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Super-admin not found"));

        // 1) check password
        if (!hasher.matches(req.getPassword(), sa.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        // 2) check secret key
        if (!verifySecret(sa.getId(), req.getSecretKey())) {
            throw new BadCredentialsException("Invalid secret key");
        }

        // 3) build Authentication token
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_SUPER_ADMIN");
        return new UsernamePasswordAuthenticationToken(
                sa.getUsername(),
                null,
                List.of(authority)
        );
    }

    public UserInfoDto buildUserInfoDto(String username) {
        SuperAdmin sa = superAdminRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Super-admin not found"));

        // map only the fields your UserInfoDto needs
        UserInfoDto dto = new UserInfoDto();
        dto.setVerified(true);  // super-admins are always verified
        return dto;
    }
}