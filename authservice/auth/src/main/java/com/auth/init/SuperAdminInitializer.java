package com.auth.init;

import com.auth.dto.CreateSuperAdminRequest;
import com.auth.model.Role;
import com.auth.repository.RoleRepository;
import com.auth.service.SuperAdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SuperAdminInitializer implements ApplicationRunner {

    private final SuperAdminService superAdminService;
    private final RoleRepository roleRepo;

    @Value("${superadmin.firstname:Sys}")
    private String firstName;

    @Value("${superadmin.lastname:Admin}")
    private String lastName;

    @Value("${superadmin.username:sysadmin}")
    private String username;

    @Value("${superadmin.password:ChangeMe123!}")
    private String rawPassword;

    @Value("${superadmin.email:admin@example.com}")
    private String email;

    @Value("${superadmin.audit-level:1}")
    private Integer auditLevel;

    public SuperAdminInitializer(SuperAdminService superAdminService,
                                 RoleRepository roleRepo) {
        this.superAdminService = superAdminService;
        this.roleRepo          = roleRepo;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        long existing = superAdminService.countSuperAdmins();
        if (existing > 0) {
            log.info("SuperAdmin already exists, skipping initialization.");
            return;
        }

        // resolve the SUPER_ADMIN Role from the DB (assumes it’s already there)
        Role superAdminRole = roleRepo.findByName("ROLE_SUPER_ADMIN")
                .orElseThrow(() -> new IllegalStateException("Role ROLE_SUPER_ADMIN not found"));

        CreateSuperAdminRequest req = CreateSuperAdminRequest.builder()
                .username(username)
                .rawPassword(rawPassword)
                .email(email)
                .role(superAdminRole)
                .auditLevel(auditLevel)
                .build();

        // this returns the one-time raw secretKey that you must record
        String secretKey = superAdminService.provisionSuperAdmin(req);

        log.info("=== SuperAdmin initialized ===");
        log.info("Username:    {}", username);
        log.info("Password:    {}", rawPassword);
        log.info("Secret Key:  {}  <-- record this ONE TIME!", secretKey);
    }
}
