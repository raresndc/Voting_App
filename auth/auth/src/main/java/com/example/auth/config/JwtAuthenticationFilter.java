package com.example.auth.config;

import com.example.auth.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
//    The JwtAuthenticationFilter ensures that only valid requests with a proper JWT can access protected endpoints.

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwt); // Extract email from the token
        }

        if (email != null && jwtUtil.validateToken(jwt, email)) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (userDetails.getPassword().isEmpty()) {
                    log.warn("User is in account creation flow: {}", email);
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (UsernameNotFoundException e) {
                log.error("User not found: {}", email);
            }
        }


        chain.doFilter(request, response);
    }
}

//How It Works:
//Extract Token: The filter extracts the token from the Authorization header.
//Validate Token: The token is validated for authenticity and expiration.
//Authenticate User: If valid, the user is authenticated and stored in the SecurityContext.
//Why This Approach?
//Ensures only authenticated users can access protected endpoints.
//Integrates seamlessly with Spring Security's authentication mechanism.