package com.auth.dto;

import com.auth.model.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Full name is required!")
    @Size(min = 3, max = 50, message = "Full name must be between 3 and 50 characters!")
    private String fullName;

    @NotBlank(message = "Username is required!")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters!")
    private String username;

    @NotBlank(message = "Password is required!")
    @Size(min = 3, message = "Password must be larger than 3 characters!")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}
