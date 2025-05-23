package com.auth.repository;

import com.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);

    Optional<User> findByPersonalIdNo(String personalIdNo);
    Boolean existsByPersonalIdNo(String personalIdNo);

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    Optional<User> findByPhoneNo(String phoneNo);
    Boolean existsByPhoneNo(String phoneNo);
}
