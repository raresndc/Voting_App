package com.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TwoFaLoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotNull
    private Integer code;
}
