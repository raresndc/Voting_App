package com.voting.votingService.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class SignatureService {

    @Value("${evoting.publicKeyPath}")
    private Resource publicKeyResource;

    // 1) inject the same RSA parameters your auth service uses:
    @Value("${rsa.modulus}")
    private String modHex;

    @Value("${rsa.publicExp}")
    private int pubExp;

    private BigInteger modulus;
    private BigInteger publicExp;

    @PostConstruct
    public void init() throws Exception {
        // decode the PEM exactly as before, so you still verify structure
        String pem = new String(publicKeyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8)
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] keyBytes = Base64.getDecoder().decode(pem);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        var kf = java.security.KeyFactory.getInstance("RSA");
        RSAPublicKey rsaPub = (RSAPublicKey) kf.generatePublic(spec);

        // build BigInteger parameters from your config
        this.modulus   = new BigInteger(modHex, 16);
        this.publicExp = BigInteger.valueOf(pubExp);

        // sanity check: the modulus from the PEM must match the config!
        if (!modulus.equals(rsaPub.getModulus())) {
            throw new IllegalStateException(
                    "Config modulus does not match PEM modulus:\n" +
                            " config=" + modulus.toString(16) + "\n" +
                            "   pem=" + rsaPub.getModulus().toString(16)
            );
        }

        System.out.println("VOTE RSA MODULUS = " + modulus.toString(16));
        System.out.println("VOTE RSA EXPONENT = " + publicExp);
    }

    /**
     * Raw RSA verify: decrypt the signature via modPow(e,n) and compare to the raw message.
     */
    public boolean verify(byte[] data, byte[] signature) {
        BigInteger m = new BigInteger(1, data);       // original message
        BigInteger s = new BigInteger(1, signature);  // signature as integer

        // mPrime = s^e mod n
        BigInteger mPrime = s.modPow(publicExp, modulus);
        return mPrime.equals(m);
    }
}
