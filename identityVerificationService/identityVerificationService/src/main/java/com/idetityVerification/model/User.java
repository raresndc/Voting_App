package com.idetityVerification.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "app_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

//    @Column(
//           name = "full_name",
//           nullable=false
//    )
//    private String fullName;

    @Column(
            name = "first_name",
            nullable=false
    )
    private String firstName;

    @Column(
            name = "last_name",
            nullable=false
    )
    private String lastName;

    @Column(
            nullable = false,
            unique = true
    )
    private String username;

    @Column(
            nullable = false
    )
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(
            nullable = false,
            unique = true
    )
    private String phoneNo;

    @Column(
            nullable = false
    )
    private String gender;

    @Column(
            nullable = false,
            unique = true
    )
    private String email;

    @Column(
            nullable = false,
            unique = true
    )
    private String personalIdNo;

    @Column(
            nullable = false
    )
    private String citizenship;

    @Column(
            nullable = false
    )
    private String country;

    @Column(
            nullable = false
    )
    private String county;

    @Column(
            nullable = false
    )
    private String city;

    @Column(
            nullable = false
    )
    private String address;

    @Column(
            nullable = false
    )
    private LocalDate dob;

    private Integer age;

    @Builder.Default
    private boolean verified = false;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_expiry_date")
    private LocalDateTime verificationExpiryDate;

    @Column(name = "two_factor_enabled")
    private boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @CreatedDate
    private LocalDateTime createdDate;

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;

    @Column(
            nullable = false,
            unique = true
    )
    private String IDseries;

    @Column(name = "identityVerification")
    private Boolean identityVerification = false;

    public User(String firstName,
                String lastName,
                String username,
                String password,
                Role role,
                String phoneNo,
                String gender,
                String email,
                String personalIdNo,
                String citizenship,
                String country,
                String county,
                String city,
                String address,
                LocalDate dob,
                Integer age,
                boolean verified,
                boolean identityVerification) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.role = role;
        this.phoneNo = phoneNo;
        this.gender = gender;
        this.email = email;
        this.personalIdNo = personalIdNo;
        this.citizenship = citizenship;
        this.country = country;
        this.county = county;
        this.city = city;
        this.address = address;
        this.dob = dob;
        this.age = age;
        this.verified = verified;
        this.identityVerification = identityVerification;
    }

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isIdentityVerification() {
        return identityVerification;
    }

    public void setIdentityVerification(boolean identityVerification) {
        this.identityVerification = identityVerification;
    }
}
