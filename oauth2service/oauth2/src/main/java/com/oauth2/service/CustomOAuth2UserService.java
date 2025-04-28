package com.oauth2.service;

import com.oauth2.model.Role;
import com.oauth2.model.User;
import com.oauth2.repository.RoleRepository;
import com.oauth2.repository.UserRepository;
import com.oauth2.util.RoleName;
import com.oauth2.wrapper.AppOAuth2User;
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
public class CustomOAuth2UserService
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest req)
            throws OAuth2AuthenticationException {

        // delegate to the default to fetch the user’s attributes
        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(req);

        // registrationId == "google" or "facebook" or "github"
        String registrationId = req.getClientRegistration()
                .getRegistrationId().toUpperCase();

        // dynamically fetch the key Spring is using for the "username"
        String userNameAttributeName = req.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        // that key is "sub" for Google, "id" for FB/GH by default
        String providerId = oauth2User.getAttribute(userNameAttributeName);

        // lookup or sign-up
        User user = userRepo.findByProviderAndProviderId(registrationId, providerId)
                .orElseGet(() -> firstTimeSignup(
                        oauth2User, registrationId, providerId));

        // now build a Spring Security user, supplying the *same* username-attr
        return new AppOAuth2User(
                user,
                mapAuthorities(user.getRoles()),
                oauth2User.getAttributes(),
                "sub");

    }

    private User firstTimeSignup(OAuth2User oauth2User,
                                 String provider,
                                 String providerId) {
        User user = new User();
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setEmail(oauth2User.getAttribute("email"));
        user.setDisplayName(oauth2User.getAttribute("name"));
        user.setPictureUrl(oauth2User.getAttribute("picture"));

        RoleName roleName = userRepo.count() == 0
                ? RoleName.SUPER_ADMIN
                : RoleName.USER;

        user.getRoles().add(roleRepo.getReferenceById(roleName));
        return userRepo.save(user);
    }

    private Collection<? extends GrantedAuthority> mapAuthorities(
            Set<Role> roles
    ) {
        return roles.stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                .toList();
    }
}


