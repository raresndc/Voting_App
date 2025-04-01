package com.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.ElDescription;

public interface ElDescriptionRepository extends JpaRepository<ElDescription, Integer> {
	
	Page<ElDescription> findAll(Pageable pageable);

}
