package com.auth.dto;

public class RsaKeyResponse {
    private String modulus;
    private String exponent;

    public RsaKeyResponse() { }

    public RsaKeyResponse(String modulus, String exponent) {
        this.modulus = modulus;
        this.exponent = exponent;
    }

    public String getModulus() {
        return modulus;
    }

    public void setModulus(String modulus) {
        this.modulus = modulus;
    }

    public String getExponent() {
        return exponent;
    }

    public void setExponent(String exponent) {
        this.exponent = exponent;
    }
}
