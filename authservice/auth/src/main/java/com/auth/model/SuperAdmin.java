package com.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "super_admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdmin {

    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "secret_key_hash", nullable = false)
    private String secretKeyHash;

    @Column(name = "audit_level", nullable = false)
    private int auditLevel;

    @Column(name = "email", nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
            name = "role_id",
            referencedColumnName = "id"
    )
    private Role role;

}
