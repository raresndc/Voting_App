package com.auth.controller;

import com.auth.dto.*;
import com.auth.model.Issuance;
import com.auth.model.VoteToken;
import com.auth.repository.IssuanceRepository;
import com.auth.repository.UserRepository;
import com.auth.repository.VoteTokenRepository;
import com.auth.service.JwtService;
import com.auth.service.RsaBlindSignatureService;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.Principal;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    private final RsaBlindSignatureService rsaService;
    private final VoteTokenRepository tokenRepo;
    private final UserRepository userRepo;
    private final JwtService jwtService;
    @Autowired
    private IssuanceRepository issuanceRepo;

    @Autowired
    public VoteController(RsaBlindSignatureService blindService,
                          VoteTokenRepository tokenRepo,
                          UserRepository userRepo,
                          JwtService jwtService) {
        this.rsaService = blindService;
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }

//    @PostMapping("/generate")
//    public EvuidResponse generateToken() {
//        byte[] rawVuid = rsaService.generateRandomVUID();
//        String evuid   = Base64.getEncoder().encodeToString(rawVuid);
//
//        // persist a new row with used=false
//        VoteToken token = new VoteToken();
//        token.setEvuid(evuid);
//        token.setUsed(false);
//        tokenRepo.save(token);
//
//        return new EvuidResponse(evuid);
//    }

//    @PostMapping("/challenge")
//    public BlindChallenge getBlindChallenge(@RequestBody ChallengeRequest req) {
//        // 1) Lookup the pre‐created token
//        VoteToken token = tokenRepo.findByEvuid(req.evuid())
//                .orElseThrow(() -> new ResponseStatusException(
//                        HttpStatus.NOT_FOUND, "Token not found: " + req.evuid()
//                ));
//
//        // 2) Generate r & blind
//        byte[] rawVuid = Base64.getDecoder().decode(req.evuid());
//        BigInteger r       = rsaService.generateR();
//        BigInteger blinded = rsaService.blind(new BigInteger(1, rawVuid), r);
//
//        // 3) Update the existing token’s blindingFactor
//        token.setBlindingFactor(
//                Base64.getEncoder().encodeToString(r.toByteArray())
//        );
//        tokenRepo.save(token);
//
//        // 4) Return the blinded value
//        String blindedB64 = Base64.getEncoder()
//                .encodeToString(blinded.toByteArray());
//        return new BlindChallenge(req.evuid(), blindedB64);
//    }

    @GetMapping("/generate")
    @PermitAll
    public RsaKeyResponse generate() {
        // return modulus and exponent for client blinding
        BigInteger n = rsaService.getModulus();
        BigInteger e = rsaService.getPublicExponent();
        return new RsaKeyResponse(n.toString(), e.toString());
    }

    @PostMapping("/challenge")
    public ResponseEntity<String> challenge(@RequestBody ChallengeRequest req,
                                            Principal principal) {
        String evuid = principal.getName();

        // enforce one issuance per user
        Issuance iss = issuanceRepo.findByEvuid(evuid)
                .orElseGet(() -> issuanceRepo.save(new Issuance(evuid)));
        if (iss.isIssued()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // sign the blinded value
        byte[] sigBlinded = rsaService.signBlinded(new BigInteger(req.getBlinded())).toByteArray();
        String sigB64 = Base64.getEncoder().encodeToString(sigBlinded);

        // mark as issued and persist
        iss.setIssued(true);
        issuanceRepo.save(iss);

        return ResponseEntity.ok(sigB64);
    }


    @PostMapping("/token")
    public SignedToken unblindAndSign(@RequestBody UnblindRequest req) {
        // 1) decode the client’s blinded signature
        BigInteger signedBlinded = new BigInteger(
                1,
                Base64.getDecoder().decode(req.blindedSignature())
        );

        // 2) server‐side RSA sign
        BigInteger sBlinded = rsaService.signBlinded(signedBlinded);

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
        byte[] realSigBytes = rsaService.unblind(sBlinded, r);
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
        BigInteger n = rsaService.getModulus();
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
