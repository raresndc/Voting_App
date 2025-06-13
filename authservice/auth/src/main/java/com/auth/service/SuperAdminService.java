package com.auth.service;

import com.auth.dto.CreateSuperAdminRequest;
import com.auth.model.Role;
import com.auth.model.SuperAdmin;
import com.auth.model.User;
import com.auth.repository.RoleRepository;
import com.auth.repository.SuperAdminRepository;
import com.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
public class SuperAdminService {
    private final UserRepository userRepo;
    private final SuperAdminRepository superAdminRepo;
    private final PasswordEncoder hasher;     // Argon2id or bcrypt adapter
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
}