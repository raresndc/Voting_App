package com.auth.dto;

import lombok.Data;

@Data
public class Confirm2FARequest {
    private String username;
    private int code;
}
