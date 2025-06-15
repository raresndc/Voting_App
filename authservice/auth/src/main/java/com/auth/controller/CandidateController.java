package com.auth.controller;

import com.auth.model.Candidate;
import com.auth.model.SuperUser;
import com.auth.repository.SuperUserRepository;
import com.auth.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.listCandidates();
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
}
