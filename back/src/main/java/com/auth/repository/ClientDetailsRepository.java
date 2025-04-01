package com.auth.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.auth.entity.OauthClientDetails;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface ClientDetailsRepository extends JpaRepository<OauthClientDetails, Long> {
	
	OauthClientDetails findOauthClientDetailsByClientId(String clientId);
	
}