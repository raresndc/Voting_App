package com.auth.dto;

public record UnblindRequest(
        String evuid,
        String blindedSignature
) {
}
