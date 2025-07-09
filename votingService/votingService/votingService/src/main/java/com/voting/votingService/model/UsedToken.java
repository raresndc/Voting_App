package com.voting.votingService.model;

import jakarta.persistence.*;

@Entity
public class UsedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 2048)
    private String token;

    public UsedToken() {}
    public UsedToken(String token) { this.token = token; }
    public Long getId() { return id; }
    public String getToken() { return token; }
}
