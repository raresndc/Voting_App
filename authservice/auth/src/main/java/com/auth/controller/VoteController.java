package com.auth.controller;

import com.auth.dto.BlindChallenge;
import com.auth.dto.SignedToken;
import com.auth.dto.UnblindRequest;
import com.auth.model.User;
import com.auth.model.VoteToken;
import com.auth.repository.UserRepository;
import com.auth.repository.VoteTokenRepository;
import com.auth.service.JwtService;
import com.auth.service.RsaBlindSignatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigInteger;
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

    @GetMapping("/challenge")
    public BlindChallenge getBlindChallenge(@RequestHeader("Authorization") String jwt) {
        // 1. Verify JWT & 2FA via your existing filter chain
        User user = jwtService.extractUser(jwt);

        // 2. Generate the raw e-VUID
        byte[] rawVUID = blindService.generateRandomVUID();

        // 3. Blind it and keep track of `r`; return blinded value and an ID to link later
        BigInteger blinded = blindService.blind(rawVUID);
        String blindedBase64 = Base64.getEncoder().encodeToString(blinded.toByteArray());

        // 4. Persist a placeholder so we know to attach the final signature
        VoteToken placeholder = new VoteToken();
        placeholder.setEvuid(Base64.getEncoder().encodeToString(rawVUID));
        placeholder.setOwner(user);
        tokenRepo.save(placeholder);

        return new BlindChallenge(placeholder.getId(), blindedBase64);
    }

    @PostMapping("/token")
    public SignedToken unblindAndSign(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UnblindRequest req) {

        // 1. Verify JWT & retrieve the placeholder
        User user = jwtService.extractUser(jwt);
        VoteToken placeholder = tokenRepo.findById(req.getPlaceholderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!placeholder.getOwner().equals(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        // 2. Sign the blinded value stored client-side
        BigInteger signedBlinded = new BigInteger(1, Base64.getDecoder().decode(req.getBlindedSignature()));
        BigInteger signed = blindService.signBlinded(signedBlinded);

        // 3. Unblind: client does this locally with `r`, but you can verify if you store `r` server-side.
        //    (Often you let the client unblind; here we just return the raw signed bytes.)
        String signatureBase64 = Base64.getEncoder().encodeToString(signed.toByteArray());

        // 4. Update the DB row with the real signature
        placeholder.setSignedToken(signatureBase64);
        tokenRepo.save(placeholder);

        return new SignedToken(placeholder.getEvuid(), signatureBase64);
    }
}
