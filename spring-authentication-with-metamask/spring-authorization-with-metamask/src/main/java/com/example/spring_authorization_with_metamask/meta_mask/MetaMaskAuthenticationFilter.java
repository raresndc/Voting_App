package com.example.spring_authorization_with_metamask.meta_mask;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

public class MetaMaskAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    protected MetaMaskAuthenticationFilter() {
        super(new AntPathRequestMatcher("/login", "POST"));
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        UsernamePasswordAuthenticationToken authRequest = getAuthRequest(request);
        authRequest.setDetails(this.authenticationDetailsSource.buildDetails(request));
        return this.getAuthenticationManager().authenticate(authRequest);
    }


    private UsernamePasswordAuthenticationToken getAuthRequest(HttpServletRequest request) {
        String address = request.getParameter("address");
        String signature = request.getParameter("signature");
        return new MetaMaskAuthenticationRequest(address, signature);
    }
}
