package com.oauth2.service;

import com.oauth2.model.User;
import com.oauth2.repository.RoleRepository;
import com.oauth2.repository.UserRepository;
import com.oauth2.wrapper.AppOidcUser;
import jakarta.transaction.Transactional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class CustomOidcUserService extends OidcUserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    public CustomOidcUserService(UserRepository userRepo, RoleRepository roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest request) throws OAuth2AuthenticationException {
        OidcUser oidc = super.loadUser(request);

        String provider   = request.getClientRegistration().getRegistrationId().toUpperCase();
        String providerId = oidc.getSubject();

        User user = userRepo.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    // copy your “firstTimeSignup” logic here
                    User u = new User();
                    u.setProvider(provider);
                    u.setProviderId(providerId);
                    u.setEmail(oidc.getAttribute("email"));
                    u.setDisplayName(oidc.getAttribute("name"));
                    u.setPictureUrl(oidc.getAttribute("picture"));
                    // assign roles…
                    return userRepo.save(u);
                });

        Collection<GrantedAuthority> auths = user.getRoles().stream()
                .map(r -> (GrantedAuthority) () -> "ROLE_" + r.getName())
                .toList();

        return new AppOidcUser( user, auths, oidc.getIdToken(), oidc.getUserInfo() );
    }
}
