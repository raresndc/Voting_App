package com.voting.votingService.web;

import com.voting.votingService.domain.CandidateRepository;
import com.voting.votingService.service.CandidateService;
import com.voting.votingService.service.VotingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/votes")
public class VotingController {
    private final VotingService svc;
    private final CandidateService candSvc;

    public VotingController(VotingService svc, CandidateService candSvc) {
        this.svc = svc;
        this.candSvc = candSvc;
    }

    @GetMapping("/hasVoted")
    public boolean hasVoted(@RequestParam Long userId) {
        return svc.hasVoted(userId);
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

    @GetMapping("/summaries")
    @PreAuthorize("hasRole('SUPER_USER')")
    public List<CandidateRepository.CandidateSummary> allSummaries() {
        return candSvc.getAllCandidateSummaries();
    }

    public static record CastRequest(
            String evuid,
            String candidateId,
            String signature
    ) {}
}
