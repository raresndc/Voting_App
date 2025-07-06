package com.voting.votingService.web;

import com.voting.votingService.service.VotingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("/api/votes")
public class VotingController {
    private final VotingService svc;

    public VotingController(VotingService svc) {
        this.svc = svc;
    }

    @GetMapping("/hasVoted/{evuid}")
    public boolean hasVoted(@PathVariable String evuid) throws Exception {
        return svc.hasVoted(evuid);
    }

    @PostMapping("/cast")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cast(@RequestBody CastRequest req) throws Exception {
        byte[] sig = Base64.getDecoder().decode(req.signature());
        svc.castVote(req.evuid(), req.candidateId(), sig);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count/{candidateId}")
    @PreAuthorize("hasRole('SUPER_USER')")
    public long count(@PathVariable String candidateId) throws Exception {
        return svc.getVoteCount(candidateId);
    }

    public static record CastRequest(
            String evuid,
            String candidateId,
            String signature
    ) {}
}
