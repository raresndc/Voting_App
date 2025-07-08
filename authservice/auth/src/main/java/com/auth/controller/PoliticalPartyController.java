package com.auth.controller;

import com.auth.model.PoliticalParty;
import com.auth.service.PoliticalPartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
@RequiredArgsConstructor
public class PoliticalPartyController {
    private final PoliticalPartyService service;

    @GetMapping
    public List<PoliticalParty> listAll() {
        return service.getAllParties();
    }
}
