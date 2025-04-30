package com.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Setup2FAResponse {
    private String secret;
    private String qrCodeUrl; // otpauth://… URI you can render as QR
}
