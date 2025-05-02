package com.auth.service;

import com.auth.model.Candidate;
import com.auth.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public void voteForCandidate(String username) {
        Candidate candidate = candidateRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        candidate.setVotes(candidate.getVotes() + 1);
        candidateRepository.save(candidate);
    }
}
