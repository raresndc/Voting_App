package com.voting.votingService.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "vote_tokens")
public class VoteToken {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String evuid;

    @Column(nullable = true, length = 512)
    private String signedToken;

    @Column(nullable = false)
    private Boolean used = false;

    @Column(name = "user_id")
    private Long userId;

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
