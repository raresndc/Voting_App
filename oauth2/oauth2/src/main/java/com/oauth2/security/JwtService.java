package com.oauth2.security;

import com.oauth2.model.Token;
import com.oauth2.model.User;
import com.oauth2.repository.TokenRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtService {

    @Value("${app.jwt.secret}")         // 256-bit HMAC secret
    private String secret;

    private final TokenRepository tokenRepo;

    /* ───────── ACCESS JWT ───────── */
    public String createAccessToken(User user) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("roles", user.getRoles().stream().map(r -> r.getName().name()).toList())
                .issuer("oauth-service")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(15, ChronoUnit.MINUTES)))
                .signWith(signingKey())                           // HS256 by default
                .compact();
    }

    /* ───────── REFRESH TOKEN ────── */
    public String createRefreshToken(User user) {
        String raw = UUID.randomUUID().toString();

        Instant expiry = Instant.now().plus(30, ChronoUnit.DAYS);
        tokenRepo.save(new Token(raw, expiry, false, user));      // convenience ctor

        return raw;
    }

    /* ───────── helpers ──────────── */
    private Key signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}