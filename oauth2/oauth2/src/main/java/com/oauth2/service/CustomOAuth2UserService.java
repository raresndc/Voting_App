package com.oauth2.service;

import com.oauth2.model.Role;
import com.oauth2.model.User;
import com.oauth2.repository.RoleRepository;
import com.oauth2.repository.UserRepository;
import com.oauth2.util.RoleName;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest req) throws OAuth2AuthenticationException {
        OAuth2User googleUser = new DefaultOAuth2UserService().loadUser(req);

        String provider = req.getClientRegistration().getRegistrationId().toUpperCase();
        String providerId = googleUser.getName();                                           //sub for google

        User user = userRepo.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> firstTimeSignup(googleUser, provider, providerId));

        return new DefaultOAuth2User(
                mapAuthorities(user.getRoles()),
                googleUser.getAttributes(),
                "sub");
    }

    private User firstTimeSignup(OAuth2User oauth, String provider, String providerId) {
        User user = new User();
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setEmail(oauth.getAttribute("email"));
        user.setDisplayName(oauth.getAttribute("name"));
        user.setPictureUrl(oauth.getAttribute("picture"));

        /*  SIMPLE ROLE STRATEGY
            – first account becomes SUPER_ADMIN
            – everyone else USER
            – later you can import seeded ADMINs via data.sql / Flyway
        */

        RoleName roleName = userRepo.count() == 0 ? RoleName.SUPER_ADMIN : RoleName.USER;
        user.getRoles().add(roleRepo.getReferenceById(roleName));

        return userRepo.save(user);
    }

    private Collection<? extends GrantedAuthority> mapAuthorities(Set<Role> roles) {
        return roles.stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                .toList();
    }
}
