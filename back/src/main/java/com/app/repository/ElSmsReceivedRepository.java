package com.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entity.ElSmsReceived;
import com.app.entity.ElSmsSend;

public interface ElSmsReceivedRepository extends JpaRepository<ElSmsReceived, Long> {

	@org.springframework.data.jpa.repository.Query("select u from ElSmsReceived u where u.elDevice.id = ?1 order by u.id desc ")
	Page<ElSmsReceived> findAllReceivedMessagesByDevice(int id, Pageable page);

	
	@org.springframework.data.jpa.repository.Query("SELECT u FROM ElSmsReceived u WHERE u.importDate BETWEEN ?1 AND ?2 ORDER BY u.importDate DESC")
    Page<ElSmsReceived> findAllReceivedMessages(Pageable page);
	
	Page<ElSmsReceived> findAllByOrderByImportDateDesc(Pageable pageable);
}
