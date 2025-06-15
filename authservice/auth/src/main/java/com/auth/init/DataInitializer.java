package com.auth.init;

import com.auth.dto.CreateSuperAdminRequest;
import com.auth.model.PoliticalParty;
import com.auth.model.Role;
import com.auth.model.SuperUser;
import com.auth.repository.PoliticalPartyRepository;
import com.auth.repository.RoleRepository;
import com.auth.repository.SuperUserRepository;
import com.auth.service.SuperAdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class DataInitializer implements ApplicationRunner {

    private final SuperAdminService superAdminService;
    private final RoleRepository roleRepo;
    private final PoliticalPartyRepository partyRepo;
    private final SuperUserRepository superUserRepo;
    private final PasswordEncoder passwordEncoder;

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

    @Value("${superuser.username.psd}")
    private String psdUsername;

    @Value("${superuser.password.psd}")
    private String psdPassword;

    @Value("${superuser.username.pnl}")
    private String pnlUsername;

    @Value("${superuser.password.pnl}")
    private String pnlPassword;

    @Value("${superuser.username.usr}")
    private String usrUsername;

    @Value("${superuser.password.usr}")
    private String usrPassword;

    @Value("${superuser.username.aur}")
    private String aurUsername;

    @Value("${superuser.password.aur}")
    private String aurPassword;

    @Value("${superuser.username.ind}")
    private String indUsername;

    @Value("${superuser.password.ind}")
    private String indPassword;

    @Value("${superuser.username.udmr}")
    private String udmrUsername;

    @Value("${superuser.password.udmr}")
    private String udmrPassword;

    public DataInitializer(SuperAdminService superAdminService,
                           RoleRepository roleRepo,
                           PoliticalPartyRepository politicalPartyRepo,
                           SuperUserRepository superUserRepo,
                           PasswordEncoder passwordEncoder) {
        this.superAdminService = superAdminService;
        this.roleRepo          = roleRepo;
        this.superUserRepo     = superUserRepo;
        this.partyRepo         = politicalPartyRepo;
        this.passwordEncoder   = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Ensure SUPER_USER role exists
        Role superUserRole = roleRepo.findByName("ROLE_SUPER_USER")
                .orElseGet(() -> {
                    log.info("Creating role: ROLE_SUPER_USER");
                    return roleRepo.save(new Role("ROLE_SUPER_USER"));
                });

        // Initialize political parties
        Map<String, PoliticalParty> parties = new HashMap<>();
        List<String> partyNames = List.of(
                "Partidul Social Democrat",
                "Partidul National Liberal",
                "Uniunea Salvati Romania",
                "Alianta pentru Uniunea Romanilor",
                "Independent",
                "Uniunea Democrata Maghiara din Romania"
        );
        for (String name : partyNames) {
            PoliticalParty party = partyRepo.findByName(name)
                    .orElseGet(() -> {
                        log.info("Creating political party: {}", name);
                        return partyRepo.save(PoliticalParty.builder().name(name).build());
                    });
            parties.put(name, party);
        }

        // Initialize super-users for each party
        List<SuperUser> superUsers = List.of(
                SuperUser.builder()
                        .username(psdUsername)
                        .password(passwordEncoder.encode(psdPassword))
                        .email("psd@gmail.com")
                        .auditLevel(1)
                        .role(superUserRole)
                        .politicalParty(parties.get("Partidul Social Democrat"))
                        .build(),
                SuperUser.builder()
                        .username(pnlUsername)
                        .password(passwordEncoder.encode(pnlPassword))
                        .email("pnl@gmail.com")
                        .auditLevel(1)
                        .role(superUserRole)
                        .politicalParty(parties.get("Partidul National Liberal"))
                        .build(),
                SuperUser.builder()
                        .username(usrUsername)
                        .password(passwordEncoder.encode(usrPassword))
                        .email("usr@gmail.com")
                        .auditLevel(1)
                        .role(superUserRole)
                        .politicalParty(parties.get("Uniunea Salvati Romania"))
                        .build(),
                SuperUser.builder()
                        .username(aurUsername)
                        .password(passwordEncoder.encode(aurPassword))
                        .email("aur@gmail.com")
                        .auditLevel(1)
                        .role(superUserRole)
                        .politicalParty(parties.get("Alianta pentru Uniunea Romanilor"))
                        .build(),
                SuperUser.builder()
                        .username(indUsername)
                        .password(passwordEncoder.encode(indPassword))
                        .email("ind@gmail.com")
                        .auditLevel(1)
                        .role(superUserRole)
                        .politicalParty(parties.get("Independent"))
                        .build(),
                SuperUser.builder()
                        .username(udmrUsername)
                        .password(passwordEncoder.encode(udmrPassword))
                        .email("udmr@gmail.com")
                        .auditLevel(1)
                        .role(superUserRole)
                        .politicalParty(parties.get("Uniunea Democrata Maghiara din Romania"))
                        .build()
        );
        for (SuperUser su : superUsers) {
            superUserRepo.findByEmail(su.getEmail()).ifPresentOrElse(
                    existing -> log.info("SuperUser {} already exists, skipping.", su.getEmail()),
                    () -> {
                        superUserRepo.save(su);
                        log.info("Created SuperUser for party {}: {}",
                                su.getPoliticalParty().getName(), su.getEmail());
                    }
            );
        }

        // Initialize SUPER_ADMIN once
        long existingSuperAdmin = superAdminService.countSuperAdmins();
        if (existingSuperAdmin > 0) {
            log.info("SuperAdmin already exists, skipping initialization.");
            return;
        }

        Role superAdminRole = roleRepo.findByName("ROLE_SUPER_ADMIN")
                .orElseThrow(() -> new IllegalStateException("Role ROLE_SUPER_ADMIN not found"));

        CreateSuperAdminRequest req = CreateSuperAdminRequest.builder()
                .username(username)
                .rawPassword(rawPassword)
                .email(email)
                .role(superAdminRole)
                .auditLevel(auditLevel)
                .build();

        String secretKey = superAdminService.provisionSuperAdmin(req);
        log.info("=== SuperAdmin initialized ===");
        log.info("Username:    {}", username);
        log.info("Password:    {}", rawPassword);
        log.info("Secret Key:  {}  <-- record this ONE TIME!", secretKey);
    }
}
