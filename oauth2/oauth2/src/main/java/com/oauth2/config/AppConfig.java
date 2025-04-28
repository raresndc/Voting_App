package com.oauth2.config;

import com.oauth2.security.JwtAuthenticationSuccessHandler;
import com.oauth2.service.CustomOAuth2UserService;
import com.oauth2.service.CustomOidcUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AppConfig {

//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                // 1️⃣ authorisation rules – lambda replaces the old no-arg method
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().authenticated()
//                )
//
//                // 2️⃣ OAuth2 login – Customizer replaces the old no-arg method
//                .oauth2Login(oauth2 -> oauth2
//                        .defaultSuccessUrl("/user", true)
//                );
//
//        return http.build();
//    }

    private final CustomOAuth2UserService oauth2UserService;
    private final CustomOidcUserService oidcUserService;
    private final JwtAuthenticationSuccessHandler successHandler;

    public AppConfig(CustomOAuth2UserService oauth2UserService,
                     CustomOidcUserService    oidcUserService,
                     JwtAuthenticationSuccessHandler successHandler) {
        this.oauth2UserService = oauth2UserService;
        this.oidcUserService   = oidcUserService;
        this.successHandler    = successHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/authorization/**",
                                "/login/oauth2/code/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(o -> o
                        .userInfoEndpoint(ui -> ui
                                .oidcUserService(oidcUserService)     // for Google OIDC
                                .userService(oauth2UserService)       // for GitHub/Facebook
                        )
                        .successHandler(successHandler)        // issue JWT + set cookies
                )
                .logout(l -> l
                        .logoutSuccessUrl("/")                 // redirect here on logout
                );

        return http.build();
    }

}
