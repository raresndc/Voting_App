package com.voting.votingService.service;

import com.voting.votingService.domain.VoteToken;
import com.voting.votingService.domain.VoteTokenRepository;
import com.voting.votingService.domain.Candidate;
import com.voting.votingService.domain.CandidateRepository;
import com.voting.votingService.security.SignatureService;
import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.ContractException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.concurrent.TimeoutException;

@Service
public class VotingService {
    private final Contract contract;
    private final CandidateRepository candidateRepo;
    private final VoteTokenRepository tokenRepo;
    private final SignatureService sigSvc;

    public VotingService(Contract contract,
                         CandidateRepository candidateRepo,
                         VoteTokenRepository tokenRepo,
                         SignatureService sigSvc) {
        this.contract = contract;
        this.candidateRepo = candidateRepo;
        this.tokenRepo = tokenRepo;
        this.sigSvc = sigSvc;
    }

    /** Returns true if this token has already been used */
    public boolean hasVoted(Long userId) {
        return tokenRepo.findByUserId(userId)
                .map(VoteToken::getUsed)
                .orElse(false);
    }

    /**
     * Verifies the blind signature, marks the token used, then
     * records the vote on Fabric and updates the vote count locally.
     */
//    @Transactional
//    public void castVote(String evuid, String candidateId, byte[] signature) throws Exception {
//        VoteToken token = tokenRepo.findByEvuid(evuid)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid token ID"));
//
//        if (Boolean.TRUE.equals(token.getUsed())) {
//            throw new IllegalStateException("This token has already been used");
//        }
//
//        // 1) Verify the signature over the raw VUID bytes
//        byte[] rawVuid = Base64.getDecoder().decode(evuid);
//        if (!sigSvc.verify(rawVuid, signature)) {
//            throw new SecurityException("Signature verification failed");
//        }
//
//        // 2) Mark token used
//        token.setUsed(true);
//        tokenRepo.save(token);
//
//        // 3) Submit to Fabric
//        contract.submitTransaction("CastVote", evuid, candidateId);
//
//        // 4) Update local count
//        Candidate c = candidateRepo.findById(Long.valueOf(candidateId))
//                .orElseThrow(() -> new IllegalArgumentException("Unknown candidate"));
//        c.setVotes(c.getVotes() + 1);
//        candidateRepo.save(c);
//    }

    public void castVote(String token, String candidateId) throws ContractException, InterruptedException, TimeoutException {
        contract.submitTransaction("CastVote", token, candidateId);
    }

    public long getVoteCount(String candidateId) throws Exception {
        byte[] res = contract.evaluateTransaction("GetVoteCount", candidateId);
        return Long.parseLong(new String(res));
    }
}
