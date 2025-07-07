package com.voting.votingService.service;

import com.voting.votingService.domain.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CandidateService {
    private final CandidateRepository repo;

    public CandidateService(CandidateRepository repo) {
        this.repo = repo;
    }

    /** Single-candidate count still works unchanged */
    public long getVoteCount(String candidateId) {
        return repo.findById(Long.valueOf(candidateId))
                .orElseThrow(() -> new NoSuchElementException(candidateId))
                .getVotes();
    }

    /** New: all candidates’ id, names & votes */
    public List<CandidateRepository.CandidateSummary> getAllCandidateSummaries() {
        return repo.findAllSummaries();
    }
}
