package com.auth.controller;

import com.auth.model.Candidate;
import com.auth.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @PostMapping("{id}/vote")
    public String voteForCandidate(@PathVariable String username) {
        candidateService.voteForCandidate(username);
        return "Vote cast successfully!";
    }

    @GetMapping("/getAllCandidates")
    public List<Candidate> getAllCandidates() {
        return candidateService.listCandidates();
    }
}
