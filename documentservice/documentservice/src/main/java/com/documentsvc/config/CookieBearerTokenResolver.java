package com.documentsvc.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.stereotype.Component;

@Component
public class CookieBearerTokenResolver implements BearerTokenResolver {
    private final DefaultBearerTokenResolver defaultResolver = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        // 1) try the Authorization header first
        String token = defaultResolver.resolve(request);
        if (token != null) {
            return token;
        }
        // 2) then look for your JWT_TOKEN cookie
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("JWT_TOKEN".equals(c.getName())) {
                    return c.getValue();        // <-- just the raw token
                }
            }
        }
        return null;
    }
}