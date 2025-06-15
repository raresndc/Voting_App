package com.auth.service;

import com.auth.model.SuperAdmin;
import com.auth.model.SuperUser;
import com.auth.model.User;
import com.auth.repository.SuperAdminRepository;
import com.auth.repository.SuperUserRepository;
import com.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;
    private final SuperUserRepository superUserRepo;
    private final SuperAdminRepository superAdminRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try User → SuperUser → SuperAdmin
        Optional<UserDetails> details = userRepo.findByUsername(username)
                .map(this::toUserDetails)
                .or(() -> superUserRepo.findByUsername(username)
                        .map(this::toUserDetailsFromSuperUser))
                .or(() -> superAdminRepo.findByUsername(username)
                        .map(this::toUserDetailsFromSuperAdmin));

        return details.orElseThrow(() ->
                new UsernameNotFoundException("User not found: " + username)
        );
    }

    private UserDetails toUserDetails(User u) {
        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                authority(u.getRole().getName())
        );
    }

    private UserDetails toUserDetailsFromSuperUser(SuperUser su) {
        return new org.springframework.security.core.userdetails.User(
                su.getUsername(),
                su.getPassword(),
                authority(su.getRole().getName())
        );
    }

    private UserDetails toUserDetailsFromSuperAdmin(SuperAdmin sa) {
        return new org.springframework.security.core.userdetails.User(
                sa.getUsername(),
                sa.getPasswordHash(),
                authority(sa.getRole().getName())
        );
    }

    private Collection<? extends GrantedAuthority> authority(String roleName) {
        // ensure your roles are e.g. "ROLE_USER", "ROLE_SUPER_USER", "ROLE_SUPER_ADMIN"
        return List.of(new SimpleGrantedAuthority(roleName));
    }
}
