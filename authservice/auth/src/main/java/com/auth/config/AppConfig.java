package com.auth.config;

import com.auth.model.Role;
import com.auth.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public CommandLineRunner seedRoles(RoleRepository roleRepository) {
        return args -> {
            createRoleIfNotExists(roleRepository, "ROLE_USER");
            createRoleIfNotExists(roleRepository, "ROLE_SUPER_USER");
            createRoleIfNotExists(roleRepository, "ROLE_SUPER_ADMIN");
            createRoleIfNotExists(roleRepository, "ROLE_CANDIDATE");
        };
    }

    public void createRoleIfNotExists(RoleRepository repository, String roleName) {
        repository.findByName(roleName).orElseGet(() -> repository.save(new Role(roleName)));
    }
}
