package com.auth.service;

import com.auth.dto.CandidateDTO;
import com.auth.dto.RegisterCandidateRequest;
import com.auth.dto.UpdateCandidateRequest;
import com.auth.model.Candidate;
import com.auth.model.SuperUser;
import com.auth.repository.CandidateRepository;
import com.auth.repository.SuperUserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    SuperUserRepository superUserRepo;

    @Autowired
    CandidateRepository candidateRepo;

    @Autowired
    AuthService authService;

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
                c.getId(),
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

    public CandidateDTO getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found"));
        return CandidateDTO.from(candidate);
    }

    @Transactional
    public void updateCandidate(Long candidateId, UpdateCandidateRequest request, Authentication auth) throws AccessDeniedException {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found"));

        // Get super user info
        String username = auth.getName();
        SuperUser superUser = superUserRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Super-user not found"));

        // Only allow update if candidate is from this party
        if (!candidate.getPoliticalParty().getId().equals(superUser.getPoliticalParty().getId())) {
            throw new AccessDeniedException("You can only modify candidates from your party.");
        }

        // Update fields
        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        candidate.setEmail(request.getEmail());
        candidate.setGender(request.getGender());
        candidate.setDob(LocalDate.parse(request.getDob()));
        candidate.setAge(request.getAge());
        candidate.setIDseries(request.getIDseries());
        // ...add more fields if needed

        candidateRepository.save(candidate);
    }

    @Transactional
    public void addCandidateForSuperUserParty(RegisterCandidateRequest req, Authentication auth) {
        // get super user from auth
        String username = auth.getName();
        SuperUser superUser = superUserRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Super-user not found"));

        // set the party id from the super user’s party
        Long partyId = superUser.getPoliticalParty().getId();
        req.setPoliticalPartyId(partyId);

        // you can reuse your registerCandidate logic:
        authService.registerCandidate(req);
    }

}
