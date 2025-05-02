package com.idetityVerification.config;

import com.idetityVerification.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // we’re stateless, so disable CSRF
                .csrf(csrf -> csrf.disable())
                // require JWT on our face-photo endpoints
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,   "/api/face-photo/**").authenticated()
                        .requestMatchers(HttpMethod.GET,    "/api/face-photo/**").authenticated()
                        // allow anything else (e.g. health check, swagger, etc.)
                        .anyRequest().permitAll()
                )
                // enable JWT-based auth
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}
