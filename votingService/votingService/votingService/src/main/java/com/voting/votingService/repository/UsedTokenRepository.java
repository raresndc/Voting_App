package com.voting.votingService.repository;

import com.voting.votingService.model.UsedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsedTokenRepository extends JpaRepository<UsedToken, Long> {
    boolean existsByToken(String token);
}
