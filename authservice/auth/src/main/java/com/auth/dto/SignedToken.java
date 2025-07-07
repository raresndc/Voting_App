package com.auth.dto;

public record SignedToken(
        String eVUID,
        String signature) {
}
