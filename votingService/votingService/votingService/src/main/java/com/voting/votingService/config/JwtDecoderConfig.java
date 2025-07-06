package com.voting.votingService.config;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class JwtDecoderConfig {

    @Value("${app.jwt.secret}")
    private String base64Secret;

    @Bean
    public JwtDecoder jwtDecoder() {
        // decode your Base64 secret into its raw bytes
        byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
        SecretKey secretKey = Keys.hmacShaKeyFor(keyBytes);

        // build a NimbusJwtDecoder that uses that same HMAC key
        return NimbusJwtDecoder.withSecretKey(secretKey).build();
    }
}

