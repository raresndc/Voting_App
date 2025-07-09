package com.auth.filter;

import com.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String token = getJwtFromRequest(request);

        // If no token, continue filter chain without setting authentication
        if (token == null || !jwtService.isValidToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Token is valid: extract username and load user
        String username = jwtService.extractUsernameFromToken(token);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.validateTokenForUser(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue processing
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest req) {
        // 1) Try Authorization header
        String authHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        // 2) Fallback to cookie
        if (req.getCookies() != null) {
            for (Cookie c : req.getCookies()) {
                if ("JWT_TOKEN".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }
        return null;
    }

//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain) throws ServletException, IOException {
//        // intercepts the request
//
//        final String authHeader = request.getHeader("Authorization");
//        final String jwt;
//        final String username;
//
//        if(authHeader == null || !authHeader.startsWith("Bearer")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        jwt = getJwtFromRequest(request);
//
//        // check if the token is valid
//        if(!jwtService.isValidToken(jwt)) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        username = jwtService.extractUsernameFromToken(jwt);
//
//        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//
//            if(jwtService.validateTokenForUser(jwt, userDetails)) {
//                UsernamePasswordAuthenticationToken authToken =
//                        new UsernamePasswordAuthenticationToken(
//                                userDetails,
//                                null,
//                                userDetails.getAuthorities()
//                        );
//                authToken.setDetails(
//                        new WebAuthenticationDetailsSource().buildDetails(request)
//                );
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//                filterChain.doFilter(request, response);
//            }
//        }
//
//        // do the validation
//        // authenticate the user
//
//
//    }
//
////    private String getJwtFromRequest(HttpServletRequest request) {
////        final String authHeader = request.getHeader("Authorization");
////        //Bearer <token>
////        return authHeader.substring(7);
////    }
//    private String getJwtFromRequest(HttpServletRequest req) {
//        // 1) Try the standard header
//        String auth = req.getHeader("Authorization");
//        if (auth != null && auth.startsWith("Bearer ")) {
//            return auth.substring(7);
//        }
//        // 2) Fallback to our secure cookie
//        if (req.getCookies() != null) {
//            for (Cookie c : req.getCookies()) {
//                if ("JWT_TOKEN".equals(c.getName())) {
//                    return c.getValue();
//                }
//            }
//        }
//        return null;
//    }
}
