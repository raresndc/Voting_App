package com.voting.votingService.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "vote_tokens")
public class VoteToken {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String evuid;       // Base64 of the raw VUID

    @Column(nullable = true, length = 512)
    private String signedToken; // Base64 of the blind‐signature

    @Column(nullable = false)
    private Boolean used = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEvuid() {
        return evuid;
    }

    public void setEvuid(String evuid) {
        this.evuid = evuid;
    }

    public String getSignedToken() {
        return signedToken;
    }

    public void setSignedToken(String signedToken) {
        this.signedToken = signedToken;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }
}
