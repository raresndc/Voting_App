package com.auth.controller;

import com.auth.dto.CandidateDTO;
import com.auth.dto.RegisterCandidateRequest;
import com.auth.dto.UpdateCandidateRequest;
import com.auth.model.Candidate;
import com.auth.model.SuperUser;
import com.auth.repository.SuperUserRepository;
import com.auth.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private SuperUserRepository superUserRepo;

    @PostMapping("/{id}/vote")
    public String voteForCandidate(@PathVariable String username) {
        candidateService.voteForCandidate(username);
        return "Vote cast successfully!";
    }

//    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
    @GetMapping
    public List<CandidateDTO> getAllCandidates() {
        return candidateService.listCandidates();
    }

    @PreAuthorize("hasRole('SUPER_USER') or hasRole('SUPER_ADMIN')")
    @GetMapping("/{candidateId}")
    public ResponseEntity<CandidateDTO> getCandidateById(@PathVariable Long candidateId) {
        CandidateDTO candidate = candidateService.getCandidateById(candidateId);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping("/votes")
    public List<CandidateDTO> getAllCandidatesVotes() {
        return candidateService.listCandidatesVotes();
    }

    @PreAuthorize("hasRole('ROLE_SUPER_USER')")
    @GetMapping("/politicalParty")
    public List<Candidate> getAllCandidatesByPoliticalParty(Authentication auth) {
        String username = auth.getName();
        SuperUser me = superUserRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("SuperUser not found: " + username));

        // 2) grab their assigned party ID
        Long partyId = me.getPoliticalParty().getId();

        // 3) fetch & return only those candidates
        return candidateService.listByPoliticalPartyId(partyId);
    }

    @PreAuthorize("hasRole('SUPER_USER') or hasRole('SUPER_ADMIN')")
    @PutMapping("/{candidateId}")
    public ResponseEntity<String> updateCandidate(
            @PathVariable Long candidateId,
            @RequestBody @Valid UpdateCandidateRequest request,
            Authentication auth) throws AccessDeniedException {

        candidateService.updateCandidate(candidateId, request, auth);
        return ResponseEntity.ok("Candidate updated successfully!");
    }

    @PreAuthorize("hasRole('SUPER_USER')")
    @PostMapping("/addCandidate")
    public ResponseEntity<String> addCandidateForOwnParty(
            @RequestBody @Valid RegisterCandidateRequest request,
            Authentication auth) {

        candidateService.addCandidateForSuperUserParty(request, auth);
        return ResponseEntity.ok("Candidate registered successfully for your party!");
    }


}
