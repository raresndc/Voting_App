package com.auth.repository;

import com.auth.model.VoteToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteTokenRepository extends JpaRepository<VoteToken, Long> {
    Optional<VoteToken> findByEvuid(String evuid);
}
