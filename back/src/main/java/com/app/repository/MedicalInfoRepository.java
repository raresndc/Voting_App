package com.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.MedicalInfo;

public interface MedicalInfoRepository extends JpaRepository<MedicalInfo, Integer> {

	Page<MedicalInfo> findAll(Pageable pageable);
	List<MedicalInfo> findByIdGreaterThan(Integer id);
	
}
