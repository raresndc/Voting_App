package com.auth.repository;

import com.auth.model.Issuance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssuanceRepository extends JpaRepository<Issuance, Long> {
    Optional<Issuance> findByEvuid(String evuid);
}
