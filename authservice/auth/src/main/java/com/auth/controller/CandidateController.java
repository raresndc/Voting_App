package com.auth.controller;

import com.auth.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
