package com.auth.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.auth.entity.OauthRefreshToken;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface OauthRefreshTokenRepository extends JpaRepository<OauthRefreshToken, Long> {

}