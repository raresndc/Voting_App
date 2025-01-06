package com.example.auth.service;

import com.example.auth.entity.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // If the user doesn't have a password yet, allow partial account creation
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password("") // No password at this stage
                    .roles("UNVERIFIED_USER") // Temporary role
                    .build();
        }

        // Fully registered users
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword()) // Hashed password
                .roles(user.getRoles().stream().map(role -> role.getName()).toArray(String[]::new))
                .build();
    }

}
