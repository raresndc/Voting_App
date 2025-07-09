package com.auth.service;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.SecureRandom;

@Service
@Getter
public class RsaBlindSignatureService {
    private final BigInteger privateExponent;
    private final BigInteger modulus;
    private final SecureRandom rnd = new SecureRandom();
    private static final BigInteger PUBLIC_EXPONENT = BigInteger.valueOf(65537);

    public BigInteger getPublicExponent() {
        return PUBLIC_EXPONENT;
    }

    public RsaBlindSignatureService(
            @Value("${rsa.modulus}") String modHex,
            @Value("${rsa.privateExp}") String expHex) {
        this.modulus         = new BigInteger(modHex, 16);
        this.privateExponent = new BigInteger(expHex, 16);
    }

    @PostConstruct
    public void logModulus() {
        // This runs once on startup; you'll see the exact modulus in your logs.
        System.out.println("AUTH RSA MODULUS = " + modulus.toString(16));
        System.out.println("AUTH PUBLIC EXPONENT = " + PUBLIC_EXPONENT);
    }

    /** (unchanged) generate a fresh e-VUID */
    public byte[] generateRandomVUID() {
        byte[] v = new byte[32];
        rnd.nextBytes(v);
        return v;
    }

    /** 1) generate a fresh blinding factor r */
    public BigInteger generateR() {
        // create random 0 < r < n
        return new BigInteger(modulus.bitLength(), rnd)
                .mod(modulus.subtract(BigInteger.ONE))
                .add(BigInteger.ONE);
    }

    /** 2) blind: compute (m * r^e mod n) */
    public BigInteger blind(BigInteger m, BigInteger r) {
        BigInteger rPowE = r.modPow(PUBLIC_EXPONENT, modulus);
        return m.multiply(rPowE).mod(modulus);
    }

    /** 3) sign the blinded data: s’ = (blinded^d mod n) */
    public BigInteger signBlinded(BigInteger blinded) {
        return blinded.modPow(privateExponent, modulus);
    }

    /** 4) unblind: m’ = (s’ * r^-1 mod n) */
    public byte[] unblind(BigInteger signedBlinded, BigInteger r) {
        BigInteger rInv   = r.modInverse(modulus);
        BigInteger mPrime = signedBlinded.multiply(rInv).mod(modulus);
        return mPrime.toByteArray();
    }

    //===================================================
    public boolean verify(BigInteger message, BigInteger signature) {
        // signature^e mod n == original message
        BigInteger recovered = signature.modPow(PUBLIC_EXPONENT, modulus);
        return recovered.equals(message);
    }
}
