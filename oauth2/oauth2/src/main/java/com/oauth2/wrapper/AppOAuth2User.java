package com.oauth2.wrapper;

import com.oauth2.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;

public class AppOAuth2User extends DefaultOAuth2User {
    private final User appUser;

    public AppOAuth2User(User appUser,
                         Collection<? extends GrantedAuthority> authorities,
                         Map<String,Object> attributes,
                         String nameAttributeKey) {
        super(authorities, attributes, nameAttributeKey);
        this.appUser = appUser;
    }

    public User getAppUser() {
        return appUser;
    }
}
