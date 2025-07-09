package com.voting.votingService.web;

import com.voting.votingService.domain.CandidateRepository;
import com.voting.votingService.model.UsedToken;
import com.voting.votingService.repository.UsedTokenRepository;
import com.voting.votingService.service.CandidateService;
import com.voting.votingService.service.RsaBlindSignatureService;
import com.voting.votingService.service.VotingService;
import com.voting.votingService.web.dto.CastRequest;
import org.hyperledger.fabric.gateway.ContractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigInteger;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeoutException;

@RestController
@RequestMapping("/api/votes")
public class VotingController {
    private final VotingService svc;
    private final CandidateService candSvc;

    @Autowired
    private RsaBlindSignatureService rsaService;
    @Autowired
    private UsedTokenRepository usedTokenRepo;

    public VotingController(VotingService svc, CandidateService candSvc) {
        this.svc = svc;
        this.candSvc = candSvc;
    }

    @GetMapping("/hasVoted")
    public boolean hasVoted(@RequestParam Long userId) {
        return svc.hasVoted(userId);
    }

    @PostMapping("/cast")
    public ResponseEntity<?> cast(@RequestBody CastRequest req) throws ContractException, InterruptedException, TimeoutException {
        BigInteger m = new BigInteger(req.getToken());
        BigInteger s = new BigInteger(req.getSignature());

        if(!rsaService.verify(m,s)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid token signature"
            );
        }

        if(usedTokenRepo.existsByToken(req.getToken())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Token already spent"
            );
        }

        usedTokenRepo.save(new UsedToken(req.getToken()));
        //submit to fabric

        svc.castVote(req.getToken(), req.getCandidateId());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/count/{candidateId}")
//    @PreAuthorize("hasRole('SUPER_USER')")
    public long count(@PathVariable String candidateId) throws Exception {
        return svc.getVoteCount(candidateId);
    }

    @GetMapping("/summaries")
//    @PreAuthorize("hasRole('SUPER_USER')")
    public List<CandidateRepository.CandidateSummary> allSummaries() {
        return candSvc.getAllCandidateSummaries();
    }

}
