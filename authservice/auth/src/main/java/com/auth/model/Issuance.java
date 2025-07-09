package com.auth.model;

import jakarta.persistence.*;

@Entity
public class Issuance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String evuid;

    private boolean issued = false;

    // Constructors, getters/setters
    public Issuance() {}
    public Issuance(String evuid) { this.evuid = evuid; }
    public Long getId() { return id; }
    public String getEvuid() { return evuid; }
    public boolean isIssued() { return issued; }
    public void setIssued(boolean issued) { this.issued = issued; }
}
