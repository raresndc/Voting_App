package com.auth.service;

import com.auth.model.PoliticalParty;
import com.auth.repository.PoliticalPartyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PoliticalPartyService {
    private final PoliticalPartyRepository repo;

    public List<PoliticalParty> getAllParties() {
        return repo.findAll();
    }
}
