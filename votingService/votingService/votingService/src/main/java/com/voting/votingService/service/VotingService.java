package com.voting.votingService.service;

import com.voting.votingService.domain.Candidate;
import com.voting.votingService.domain.CandidateRepository;
import com.voting.votingService.security.SignatureService;
import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.ContractException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VotingService {
    private final Contract contract;
    private final CandidateRepository repo;
    private final SignatureService sigSvc;

    public VotingService(Contract contract,
                         CandidateRepository repo,
                         SignatureService sigSvc) {
        this.contract = contract;
        this.repo     = repo;
        this.sigSvc   = sigSvc;
    }

    public boolean hasVoted(String evuid) throws ContractException {
        byte[] res = contract.evaluateTransaction("HasVoted", evuid);
        return Boolean.parseBoolean(new String(res));
    }

    @Transactional
    public void castVote(String evuid, String candidateId, byte[] signature) throws Exception {
        if (!sigSvc.verify(evuid.getBytes(), signature))
            throw new SecurityException("Invalid signature");

        contract.submitTransaction("CastVote", evuid, candidateId);

        Candidate c = repo.findById(Long.valueOf(candidateId))
                .orElseThrow(() -> new IllegalArgumentException("Unknown candidate"));
        c.setVotes(c.getVotes() + 1);
        repo.save(c);
    }

    public long getVoteCount(String candidateId) throws ContractException {
        byte[] res = contract.evaluateTransaction("GetVoteCount", candidateId);
        return Long.parseLong(new String(res));
    }
}
