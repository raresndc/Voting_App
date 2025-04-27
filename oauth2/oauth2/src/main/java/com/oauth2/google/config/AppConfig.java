package com.oauth2.google.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 1️⃣ authorisation rules – lambda replaces the old no-arg method
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )

                // 2️⃣ OAuth2 login – Customizer replaces the old no-arg method
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/user", true)
                );

        return http.build();
    }
}
