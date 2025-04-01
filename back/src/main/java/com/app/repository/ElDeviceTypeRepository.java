package com.app.repository;

import com.app.entity.ElDeviceType;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElDeviceTypeRepository extends JpaRepository<ElDeviceType, Integer> {
	
	Page<ElDeviceType> findAll(Pageable pageable);

	List<ElDeviceType> findByDeviceTypeName(String deviceTypeName);
}
