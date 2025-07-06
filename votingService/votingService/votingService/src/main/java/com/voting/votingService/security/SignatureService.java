package com.voting.votingService.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class SignatureService {

    @Value("${evoting.publicKeyPath}")
    private Resource publicKeyResource;

    private PublicKey publicKey;

    @PostConstruct
    public void init() throws Exception {
        // load the raw PEM text
        String pem = new String(publicKeyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        // strip header/footer and any whitespace
        pem = pem
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        // Base64-decode
        byte[] keyBytes = Base64.getDecoder().decode(pem);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        this.publicKey = kf.generatePublic(spec);
    }

    public boolean verify(byte[] data, byte[] signature) throws Exception {
        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(publicKey);
        sig.update(data);
        return sig.verify(signature);
    }
}
