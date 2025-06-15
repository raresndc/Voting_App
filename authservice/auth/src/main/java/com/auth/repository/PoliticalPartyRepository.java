package com.auth.repository;

import com.auth.model.PoliticalParty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PoliticalPartyRepository extends JpaRepository<PoliticalParty, Long> {
    Optional<PoliticalParty> findByName(String name);
}
