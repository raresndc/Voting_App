package com.oauth2.security;

import com.oauth2.model.User;
import com.oauth2.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwt;
    private final UserRepository userRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res,
                                        Authentication auth) throws IOException {

        OAuth2User oauth = (OAuth2User) auth.getPrincipal();

        /*  The provider + providerId pair are your *natural key*.
            Replace "GOOGLE" if you use multiple providers.          */
        String provider   = "GOOGLE";
        String providerId = oauth.getName();

        User user = userRepo.findByProviderAndProviderId(provider, providerId)
                .orElseThrow();                      // should never happen

        String access  = jwt.createAccessToken(user);
        String refresh = jwt.createRefreshToken(user);

        res.addHeader("Set-Cookie",
                cookie("access_token", access, Duration.ofMinutes(15), true));
        res.addHeader("Set-Cookie",
                cookie("refresh_token", refresh, Duration.ofDays(30), true));

        res.sendRedirect("/user");
    }

    /* ------------ small utility ------------ */
    private static String cookie(String name, String value,
                                 Duration maxAge, boolean httpOnly) {

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
