package com.auth.dto;

import com.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSuperAdminRequest {

//    @NotBlank(message = "First name is required")
//    private String firstName;
//
//    @NotBlank(message = "Last name is required")
//    private String lastName;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String rawPassword;

    @Email(message = "Must be a valid email address")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Role must be specified")
    private Role role;

    @NotNull(message = "Audit level is required")
    private Integer auditLevel;
}
