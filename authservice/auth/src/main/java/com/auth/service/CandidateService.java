package com.auth.service;

import com.auth.dto.CandidateDTO;
import com.auth.model.Candidate;
import com.auth.model.SuperUser;
import com.auth.repository.CandidateRepository;
import com.auth.repository.SuperUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public List<CandidateDTO> listCandidates() {
        return candidateRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CandidateDTO> listCandidatesVotes() {
        return candidateRepository.findAll().stream()
                .map(this::toDtoVotes)
                .collect(Collectors.toList());
    }

    private CandidateDTO toDto(Candidate c) {
        return new CandidateDTO(
                c.getFirstName(),
                c.getLastName(),
                c.getGender(),
                c.getDob(),
                c.getAge(),
                c.getPoliticalParty().getName(),  // or .getAcronym() if you prefer
                c.getDescription(),
                c.getPhoto()
        );
    }

    private CandidateDTO toDtoVotes(Candidate c) {
        return new CandidateDTO(
                c.getFirstName(),
                c.getLastName(),
                c.getAge(),
                c.getPoliticalParty().getName(),  // or .getAcronym() if you prefer
                c.getPhoto(),
                c.getVotes()
        );
    }

    public List<Candidate> listByPoliticalPartyId(Long partyId) {
        return candidateRepo.findByPoliticalPartyId(partyId);
    }
}
