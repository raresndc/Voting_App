package com.auth.repository;

import com.auth.model.Candidate;
import com.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {


    Optional<Candidate> findByUsername(String username);
    Boolean existsByUsername(String username);

    Optional<Candidate> findByEmail(String email);
    Boolean existsByEmail(String email);


}
