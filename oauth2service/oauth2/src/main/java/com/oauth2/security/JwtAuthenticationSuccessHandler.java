package com.oauth2.security;

import com.oauth2.model.Token;
import com.oauth2.model.User;
import com.oauth2.repository.TokenRepository;
import com.oauth2.repository.UserRepository;
import com.oauth2.wrapper.AppOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService            jwt;
    private final UserRepository       userRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req,
                                        HttpServletResponse res,
                                        Authentication auth) throws IOException {
        // auth is actually an OAuth2AuthenticationToken
        OAuth2AuthenticationToken oauthToken =
                (OAuth2AuthenticationToken) auth;

        // Principal is our AppOAuth2User
        AppOAuth2User oauthUser =
                (AppOAuth2User) oauthToken.getPrincipal();

        // No more lookup—this is the same User you saved in your OAuth2UserService
        User user = oauthUser.getAppUser();

        // Generate JWTs
        String access  = jwt.createAccessToken(user);
        String refresh = jwt.createRefreshToken(user);

        // Set cookies & redirect
        res.addHeader("Set-Cookie",
                cookie("access_token",  access,  Duration.ofMinutes(15), true));
        res.addHeader("Set-Cookie",
                cookie("refresh_token", refresh, Duration.ofDays(30),   true));
        res.sendRedirect("/user");
    }


    private static String cookie(String name, String value, Duration maxAge, boolean httpOnly) {
        return ResponseCookie.from(name, value)
                .path("/")
                .maxAge(maxAge)
                .secure(true)
                .httpOnly(httpOnly)
                .sameSite("Strict")
                .build()
                .toString();
    }
}
