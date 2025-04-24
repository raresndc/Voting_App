package com.app.uploadservice;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(AppProperties.class)   // <─ optional, see §2
public class ResourceServerConfig {

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http,
                                    CorsConfigurationSource corsSource) throws Exception {

        http
                // ↓ same as .csrf().disable() but without the deprecated call
                .csrf(csrf -> csrf.disable())

                // ↓ same idea for CORS; plug in your bean
                .cors(cors -> cors.configurationSource(corsSource))

                // ↓ authorizeHttpRequests stays, but mvcMatchers → requestMatchers
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/documents/**")
                        .hasAuthority("SCOPE_document.write")
                        .requestMatchers(HttpMethod.GET,  "/documents/**")
                        .hasAuthority("SCOPE_document.read")
                        .anyRequest().denyAll())

                // ↓ jwt() is deprecated; use the lambda form instead
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    /** Minimal CORS bean — tie it to application.yml via @ConfigurationProperties or @Value */
    @Bean
    CorsConfigurationSource corsConfigurationSource(AppProperties props) {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(props.getAllowedOrigins());   // ["https://localhost:3000"]
        cfg.setAllowedMethods(List.of("GET", "POST", "DELETE"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}

