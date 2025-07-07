package com.voting.votingService.web;

import com.voting.votingService.security.SignatureService;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/votes")
public class DebugController {

    private final SignatureService sigSvc;

    public DebugController(SignatureService sigSvc) {
        this.sigSvc = sigSvc;
    }

    public record VerifyRequest(String evuid, String signature) {}
    public record VerifyResponse(int evuidLen, int sigLen, boolean verified) {}

    @PostMapping("/verify")
    public VerifyResponse verify(@RequestBody VerifyRequest req) {
        byte[] raw = Base64.getDecoder().decode(req.evuid());
        byte[] sig = Base64.getDecoder().decode(req.signature());

        // now uses your modPow-based check
        boolean ok = sigSvc.verify(raw, sig);

        return new VerifyResponse(raw.length, sig.length, ok);
    }
}
