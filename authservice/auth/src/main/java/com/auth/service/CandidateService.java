package com.auth.service;

import com.auth.model.Candidate;
import com.auth.model.SuperUser;
import com.auth.repository.CandidateRepository;
import com.auth.repository.SuperUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    SuperUserRepository superUserRepo;

    @Autowired
    CandidateRepository candidateRepo;

    public void voteForCandidate(String username) {
        Candidate candidate = candidateRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        candidate.setVotes(candidate.getVotes() + 1);
        candidateRepository.save(candidate);
    }

    public List<Candidate> listBySuperUser(String superUserEmail) {
        SuperUser su = superUserRepo.findByEmail(superUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("No such super-user"));
        return candidateRepo.findByPoliticalParty(su.getPoliticalParty());
    }

    public List<Candidate> listCandidates() {
        return candidateRepo.findAll();
    }

    public List<Candidate> listByPoliticalPartyId(Long partyId) {
        return candidateRepo.findByPoliticalPartyId(partyId);
    }
}
