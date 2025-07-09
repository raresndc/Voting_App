package com.voting.votingService.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteTokenRepository extends JpaRepository<VoteToken, Long> {
    Optional<VoteToken> findByEvuid(String evuid);
    Optional<VoteToken> findByUserId(Long userId);
}
