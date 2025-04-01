package com.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.ElRouter;

public interface ElRouterRepository extends JpaRepository<ElRouter, Integer> {
	
	Page<ElRouter> findAll(Pageable pageable);
	
	@org.springframework.data.jpa.repository.Query("select u from ElRouter u where u.communicationDeviceRouter = TRUE")
	List<ElRouter> findAllDeviceRouters();
	
	@org.springframework.data.jpa.repository.Query("select u from ElRouter u where u.communicationDeviceRouter = FALSE")
    List<ElRouter> findByCommunicationDeviceRouterFalse();
	
	@Query("select u from ElRouter u where u.status = :status")
	List<ElRouter> findByStatus(@Param("status") String status);
	
	ElRouter findByRouterIp(String routerIp);
	
	boolean existsByRouterName(String routerName);
	
	boolean existsByRouterIp(String routerIp);
	
	boolean existsByRouterPhone(String routerPhone);
	
	boolean existsByCommunicationDeviceRouter(boolean communicationDeviceRouter);
	
	List<ElRouter> findByCommunicationDeviceRouter(boolean communicationDeviceRouter);
	
}
