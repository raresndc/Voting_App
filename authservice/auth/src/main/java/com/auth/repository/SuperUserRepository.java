package com.auth.repository;

import com.auth.model.PoliticalParty;
import com.auth.model.SuperUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SuperUserRepository extends JpaRepository<SuperUser, Long> {
    Optional<SuperUser>findByEmail(String email);
    Optional<SuperUser> findByPoliticalParty(PoliticalParty politicalParty);
    Optional<SuperUser> findByPoliticalPartyId(Long politicalPartyId);
    Optional<SuperUser> findByUsername(String username);
}
