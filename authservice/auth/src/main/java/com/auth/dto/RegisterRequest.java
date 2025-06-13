package com.auth.dto;

import com.auth.model.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
//    @NotBlank(message = "Full name is required")
//    @Size(min = 3, max = 50, message = "Full name must be between 3 and 50 characters!")
//    @Pattern(regexp = "^[A-Za-z ]+$", message = "Full name must contain only letters and spaces")
//    private String fullName;

    @NotBlank(message = "First name is required")
    @Size(min = 3, max = 50, message = "First name must be between 3 and 50 characters!")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "First name must contain only letters and spaces")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 3, max = 50, message = "Last name must be between 3 and 50 characters!")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Last name must contain only letters and spaces")
    private String lastName;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters!")
    @Pattern(
            regexp = "^[A-Za-z0-9._]+$",
            message = "Username can only contain letters, digits, dots (.), and underscores (_)"
    )
    @NoObsceneWords
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be larger than 8 characters!")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=\\-{}\\[\\]:;\"'<>,.?/]).+$",
            message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^\\+[1-9][0-9]{7,14}$",
            message = "Phone number must be in the format +<countrycode><number>, e.g. +40712345678"
    )
    @Size(min = 8, max = 16, message = "Phone number must be between 8 and 16 characters including the '+' sign")
    private String phoneNo;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Personal ID number is required")
    @Pattern(regexp = "\\d{13}", message = "Personal ID number must be exactly 13 digits")
    private String personalIdNo;

    @NotBlank(message = "Citizenship is required")
    private String citizenship;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "County is required")
    private String county;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @Min(value = 0, message = "Age must be a non-negative number")
    private Integer age;

    private String IDseries;
}
