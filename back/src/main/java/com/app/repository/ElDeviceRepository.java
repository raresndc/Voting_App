package com.app.repository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entity.ElDevice;

public interface ElDeviceRepository extends JpaRepository<ElDevice, Integer> {
	
	List<ElDevice> findByIdGreaterThan(Integer id);
	
	ElDevice findByDeviceMsisdn(String deviceMsisdn);

	ElDevice findByDeviceName(String deviceName);

	ElDevice findByDevicePhone(String devicePhone);

	ElDevice findByDeviceNameOrDevicePhone(String deviceName, String devicePhone);
	
	Page<ElDevice> findAll(Pageable pageable);
}
