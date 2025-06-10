package com.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.SecureRandom;

@Service
public class RsaBlindSignatureService {

    private final BigInteger privateExponent;
    private final BigInteger modulus;
    private final SecureRandom rnd = new SecureRandom();

    public RsaBlindSignatureService(
            @Value("${rsa.modulus}") String modHex,
            @Value("${rsa.privateExp}") String expHex) {
        this.modulus = new BigInteger(modHex, 16);
        this.privateExponent = new BigInteger(expHex, 16);
    }


    // 1) generate a fresh e-VUID
    public byte[] generateRandomVUID() {
        byte[] v = new byte[32];
        rnd.nextBytes(v);
        return v;
    }


    // 2) blind: compute blinded = (m * r^e mod n)
    public BigInteger blind(byte[] message) {
        BigInteger m = new BigInteger(1, message);
        BigInteger r = new BigInteger(modulus.bitLength(), rnd).mod(modulus);
        BigInteger e = BigInteger.valueOf(65537);
        BigInteger rPowE = r.modPow(e, modulus);
        return m.multiply(rPowE).mod(modulus);
    }

    // 3) sign the blinded data: s’ = (blinded^d mod n)
    public BigInteger signBlinded(BigInteger blinded) {
        return blinded.modPow(privateExponent, modulus);
    }

    // 4) unblind: m’ = (s’ * r^-1 mod n)
    public byte[] unblind(BigInteger signedBlinded, BigInteger r) {
        BigInteger rInv = r.modInverse(modulus);
        BigInteger mPrime = signedBlinded.multiply(rInv).mod(modulus);
        return mPrime.toByteArray();
    }
}
