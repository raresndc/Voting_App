package com.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.ElCmd;

public interface ElCmdRepository extends JpaRepository<ElCmd, Integer> {

	ElCmd findByCmdName(String cmdName);
	
	Page<ElCmd> findAll(Pageable pageable);
}
