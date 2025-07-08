package com.auth.service;

import com.auth.dto.TokenPair;
import com.auth.model.User;
import com.auth.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class JwtService {
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpirationMs;

    private static final String TOKEN_PREFIX = "Bearer ";

    @Autowired
    private UserRepository userRepo;

    public TokenPair generateTokenPair(Authentication authentication) {
        String accessToken = generateAccessToken(authentication);
        String refreshToken = generateRefreshToken(authentication);
        return new TokenPair(accessToken, refreshToken);
    }

    // generate access token

    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, jwtExpirationMs, new HashMap<>());
    }

    // generate refresh token

    public String generateRefreshToken(Authentication authentication) {
        Map<String, String> claims = new HashMap<>();
        claims.put("tokenType", "refresh");

        return generateToken(authentication, refreshExpirationMs, claims);
    }

    // validate token

    public boolean validateTokenForUser(String token, UserDetails userDetails) {
        final String username = extractUsernameFromToken(token);

        return username != null
                && username.equals(userDetails.getUsername());
    }

    public boolean isValidToken(String token) {
        return extractAllClaims(token) != null;
    }

    public long getExpirySeconds() {
        return jwtExpirationMs / 1_000;
    }

    public String extractUsernameFromToken(String token) {
        Claims claims = extractAllClaims(token);

        if(claims != null) {
            return claims.getSubject();
        }

        return null;
    }

    public User extractUserFromToken(String token) {
        if (token == null || !isValidToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT");
        }
        String username = extractUsernameFromToken(token);
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }


    // check if the token is refresh token

    public boolean isRefreshToken(String token) {
        Claims claims = extractAllClaims(token);

        if(claims == null) {
            return false;
        }

        return "refresh".equals(claims.get("tokenType"));
    }

    private Claims extractAllClaims(String token) {
        Claims claims = null;

        try {
            claims = Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException(e);
        }

        return claims;
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String generateToken(Authentication authentication, long expirationMs, Map<String, String> claims) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .header()
                .add("typ", "JWT")
                .and()
                .subject(userPrincipal.getUsername())
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSignInKey())
                .compact();
    }

    public String generatePasswordResetToken(Authentication authentication, long ttlMs) {
        Map<String, String> claims = new HashMap<>();
        claims.put("purpose", "password_reset");

        Date now = new Date();
        Date expiry = new Date(now.getTime() + ttlMs);

        // We reuse the same signing key
        return Jwts.builder()
                .header().add("typ", "JWT")
                .and()
                .setSubject(((UserDetails)authentication.getPrincipal()).getUsername())
                .addClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Validate that the token is a well-formed JWT, not expired,
     * signed correctly, and carries the expected "purpose" claim.
     */
    public boolean validatePasswordResetToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return "password_reset".equals(claims.get("purpose"))
                    && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("Invalid password-reset token: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * (Optional) Revoke a JWT by its "jti" claim. Requires storing
     * blacklisted JTIs server-side and checking in your filter.
     */
    public void revokeToken(String token) {
        Claims claims = extractAllClaims(token);
        String jti = claims.getId();
        // persist jti into a blacklist store
    }

    public String resolveToken(HttpServletRequest request) {
        // 1) Try Authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        // 2) Fallback to our cookie
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("JWT_TOKEN".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }
        return null;
    }

    /**
     * Extracts the User entity from a Bearer JWT in the Authorization header.
     * @param authHeader the raw "Authorization" header value
     * @return the authenticated User
     * @throws ResponseStatusException(401) if missing/invalid token
     * @throws ResponseStatusException(404) if user not found
     */
    public User extractUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);  // strip "Bearer "
        if (!isValidToken(token)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token");
        }

        String username = extractUsernameFromToken(token);
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    public String resolveRefreshToken(HttpServletRequest request) {
        // first try header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        // otherwise look in cookies
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("REFRESH_TOKEN".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }
        return null;
    }
}
