package com.oauth2.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "tokens")
@Getter
@Setter
@NoArgsConstructor
public class Token {
    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 512, unique = true)
    private String value;
    private Instant expiresAt;
    private boolean revoked;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public Token(String raw, Instant expiry, boolean b, User user) {

    }
}
