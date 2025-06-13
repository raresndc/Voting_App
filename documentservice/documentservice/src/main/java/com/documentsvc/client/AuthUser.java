package com.documentsvc.client;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "app_users")
@Data
public class AuthUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private int age;
    private String citizenship;

    @Column(name = "dob")
    private LocalDate dateOfBirth;

    private String gender;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "idseries")
    private String idSeries;
}
