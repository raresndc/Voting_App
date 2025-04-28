package com.oauth2.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static jakarta.persistence.CascadeType.ALL;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String provider;        //GOOGLE, GITHUB, FACEBOOK
    private String providerId;      // sub / id from OAuth provider

    private String email;
    private String displayName;
    private String pictureUrl;

    private boolean enabled = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles")
    private Set<Role> roles = new HashSet<>();

    // JWT refresh-token rotation
    @OneToMany(mappedBy = "user", cascade = ALL, orphanRemoval = true)
    private List<Token> tokens = new ArrayList<>();

}
