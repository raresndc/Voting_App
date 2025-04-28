package com.oauth2.wrapper;

import com.oauth2.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

import java.util.Collection;

public class AppOidcUser extends DefaultOidcUser {
    private final User appUser;

    public AppOidcUser(User user,
                       Collection<? extends GrantedAuthority> authorities,
                       OidcIdToken idToken,
                       OidcUserInfo userInfo) {
        super(authorities, idToken, userInfo);
        this.appUser = user;
    }

    public User getAppUser() {
        return appUser;
    }
}
