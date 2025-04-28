package com.oauth2.controller;

import com.oauth2.model.Token;
import com.oauth2.model.User;
import com.oauth2.repository.TokenRepository;
import com.oauth2.repository.UserRepository;
import com.oauth2.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TokenController {

    private final JwtService jwt;
    private final TokenRepository tokenRepo;
    private final UserRepository userRepo;

    @PostMapping("/refresh")
    public Map<String, String> refresh(@CookieValue("refresh_token") String refresh) {
        Token stored = tokenRepo.findByValueAndRevokedFalse(refresh)
                .orElseThrow(() -> new UnauthorizedException());
        User user = stored.getUser();

        // rotate – revoke used refresh token, issue a new one
        stored.setRevoked(true);
        String newRefresh = jwt.createRefreshToken(user);
        String access     = jwt.createAccessToken(user);

        return Map.of("access_token", access, "refresh_token", newRefresh);
    }
}
