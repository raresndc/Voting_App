package com.auth.dto;

public record LoginResponse (
        String accessToken,
        String refreshToken,
        String username,
        String role
) {}
