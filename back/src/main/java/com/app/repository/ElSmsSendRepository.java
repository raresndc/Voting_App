package com.app.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entity.ElSmsSend;

public interface ElSmsSendRepository extends JpaRepository<ElSmsSend, Integer>{

	@org.springframework.data.jpa.repository.Query("select u from ElSmsSend u where u.receiverDevice.id = ?1 order by u.id desc")
	Page<ElSmsSend> findAllSendMessagesByDevice(int id, Pageable page);
	
}







