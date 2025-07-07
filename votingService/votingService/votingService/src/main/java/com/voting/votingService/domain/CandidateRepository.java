package com.voting.votingService.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    interface CandidateSummary {
        String getId();
        String getFirstName();
        String getLastName();
        Long   getVotes();
    }

    @Query("""
        SELECT c.id         AS id,
               c.firstName  AS firstName,
               c.lastName   AS lastName,
               c.votes      AS votes
        FROM Candidate c
    """)
    List<CandidateSummary> findAllSummaries();
}
