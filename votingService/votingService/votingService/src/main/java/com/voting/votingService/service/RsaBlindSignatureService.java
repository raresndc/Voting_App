package com.voting.votingService.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

/**
 * RSA blind‐signature verifier for the voting service.
 */
@Service
public class RsaBlindSignatureService {

    @Value("${rsa.modulus}")
    private String modulusHex;

    @Value("${rsa.publicExp:65537}")
    private String publicExpDec;

    private BigInteger modulus;
    private BigInteger publicExponent;

    @PostConstruct
    public void init() {
        // parse the hex modulus and decimal exponent
        this.modulus = new BigInteger(modulusHex, 16);
        this.publicExponent = new BigInteger(publicExpDec);
    }

    /**
     * Verifies that signature^e mod n == message
     */
    public boolean verify(BigInteger message, BigInteger signature) {
        BigInteger recovered = signature.modPow(publicExponent, modulus);
        return recovered.equals(message);
    }

    /** Expose n if you ever need it */
    public BigInteger getModulus() {
        return modulus;
    }

    /** Expose e if you ever need it */
    public BigInteger getPublicExponent() {
        return publicExponent;
    }
}
