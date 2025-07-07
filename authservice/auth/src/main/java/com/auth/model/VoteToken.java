package com.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vote_tokens")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VoteToken {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String evuid;       //hex/base64 of the 32-byte random ID

    @Column(name = "signed_token", nullable = true, length = 512)
    private String signedToken;

    @Column(name = "blinding_factor", length = 512, nullable = true)
    private String blindingFactor;

    @Column(nullable = false)
    private Boolean used = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User owner;
}
