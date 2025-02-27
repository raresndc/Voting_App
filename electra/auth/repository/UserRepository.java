package com.auth.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.auth.entity.User;

import java.util.List;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {

	@Query("select u from User u join u.roles r where r.name in :roles")
	List<User> findByRolesIn(@Param("roles") List<String> roles);
	
	User findByUsername(String username);
	
	User findByPhoneNumberString(String phoneNumber);
	
	List<User> findByPhoneNumberStringOrUsername(String phoneNumber, String username);
	

}