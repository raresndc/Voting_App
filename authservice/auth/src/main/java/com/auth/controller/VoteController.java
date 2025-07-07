package com.auth.controller;

import com.auth.dto.*;
import com.auth.model.User;
import com.auth.model.VoteToken;
import com.auth.repository.UserRepository;
import com.auth.repository.VoteTokenRepository;
import com.auth.service.JwtService;
import com.auth.service.RsaBlindSignatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

@RestController
@RequestMapping("/vote")
public class VoteController {

    private final RsaBlindSignatureService blindService;
    private final VoteTokenRepository tokenRepo;
    private final UserRepository userRepo;
    private final JwtService jwtService;

    @Autowired
    public VoteController(RsaBlindSignatureService blindService,
                          VoteTokenRepository tokenRepo,
                          UserRepository userRepo,
                          JwtService jwtService) {
        this.blindService = blindService;
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }

    @PostMapping("/generate")
    public EvuidResponse generateToken() {
        byte[] rawVuid = blindService.generateRandomVUID();
        String evuid   = Base64.getEncoder().encodeToString(rawVuid);

        // persist a new row with used=false
        VoteToken token = new VoteToken();
        token.setEvuid(evuid);
        token.setUsed(false);
        tokenRepo.save(token);

        return new EvuidResponse(evuid);
    }

    @PostMapping("/challenge")
    public BlindChallenge getBlindChallenge(@RequestBody ChallengeRequest req) {
        // 1) Lookup the pre‐created token
        VoteToken token = tokenRepo.findByEvuid(req.evuid())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Token not found: " + req.evuid()
                ));

        // 2) Generate r & blind
        byte[] rawVuid = Base64.getDecoder().decode(req.evuid());
        BigInteger r       = blindService.generateR();
        BigInteger blinded = blindService.blind(new BigInteger(1, rawVuid), r);

        // 3) Update the existing token’s blindingFactor
        token.setBlindingFactor(
                Base64.getEncoder().encodeToString(r.toByteArray())
        );
        tokenRepo.save(token);

        // 4) Return the blinded value
        String blindedB64 = Base64.getEncoder()
                .encodeToString(blinded.toByteArray());
        return new BlindChallenge(req.evuid(), blindedB64);
    }


    @PostMapping("/token")
    public SignedToken unblindAndSign(@RequestBody UnblindRequest req) {
        // 1) decode the client’s blinded signature
        BigInteger signedBlinded = new BigInteger(
                1,
                Base64.getDecoder().decode(req.blindedSignature())
        );

        // 2) server‐side RSA sign
        BigInteger sBlinded = blindService.signBlinded(signedBlinded);

        // 3) lookup & decode r
        VoteToken token = tokenRepo.findByEvuid(req.evuid())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No such token: " + req.evuid()
                ));
        BigInteger r = new BigInteger(
                1,
                Base64.getDecoder().decode(token.getBlindingFactor())
        );

        // 4) unblind
        byte[] realSigBytes = blindService.unblind(sBlinded, r);
        String realSigB64   = Base64.getEncoder()
                .encodeToString(realSigBytes);

        // 5) persist
        token.setSignedToken(realSigB64);
        tokenRepo.save(token);

        // 6) return
        return new SignedToken(token.getEvuid(), realSigB64);
    }


    @GetMapping("/publicKey")
    public ResponseEntity<String> publicKeyPem() throws Exception {
        BigInteger n = blindService.getModulus();
        BigInteger e = BigInteger.valueOf(65537);
        RSAPublicKeySpec spec = new RSAPublicKeySpec(n, e);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        PublicKey pub = kf.generatePublic(spec);

        String pem = "-----BEGIN PUBLIC KEY-----\n"
                + Base64.getMimeEncoder(64, "\n".getBytes())
                .encodeToString(pub.getEncoded())
                + "\n-----END PUBLIC KEY-----\n";
        return ResponseEntity.ok(pem);
    }
}
