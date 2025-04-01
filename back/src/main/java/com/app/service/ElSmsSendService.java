package com.app.service;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.app.controller.dao.SendSmsDao;
import com.app.entity.ElCmd;
import com.app.entity.ElDevice;
import com.app.entity.ElSmsSend;
import com.app.repository.ElCmdRepository;
import com.app.repository.ElDeviceRepository;
import com.app.repository.ElSmsSendRepository;
import com.auth.entity.User;
import com.auth.repository.UserRepository;

@Service

public class ElSmsSendService {

	@Autowired
	ElSmsSendRepository elSmsSendRepository;

	@Autowired
	ElDeviceRepository elDeviceRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	ElCmdRepository elCmdRepository;

	@Transactional
	public Page<ElSmsSend> getSmsSend(Pageable pageable){
		return elSmsSendRepository.findAll(pageable);

	}

	@Transactional
	public 	java.util.List<ElSmsSend> getAllElements() {
		return elSmsSendRepository.findAll();
	}

	@Transactional
	public void saveSmsSend(SendSmsDao req, String username) throws Exception {

		ElDevice device = elDeviceRepository.findById(req.elDevice.getId()).orElseThrow(() -> new EntityNotFoundException("Device-ul nu exista in baza de date!"));
		ElCmd cmd = elCmdRepository.findById(req.elCmd.getId()).orElseThrow(() -> new EntityNotFoundException("Comanda nu exista in baza de date!"));
		User user = userRepository.findByUsername(username);

		int tempMin = 0;
		int tempMax = 0;
		
		if(req.temperatureInterval != null) {
			tempMin = req.temperatureInterval.tMin;
			tempMax = req.temperatureInterval.tMax;
		}

		Date date = new Date(System.currentTimeMillis());  
		Timestamp importDate= new Timestamp(date.getTime());  
		String dateString = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(importDate);
		

		if(user == null) {
			throw new Exception("Utilizatorul nu exista in baza de date!");
		}

		ElSmsSend elSmsSend = new ElSmsSend();

		elSmsSend.setCommand(cmd);
		elSmsSend.setReceiverDevice(device);
		elSmsSend.setSenderUser(user);
		elSmsSend.setImportDate(dateString);
		elSmsSend.setMinValue(tempMin);
		elSmsSend.setMaxValue(tempMax);
		elSmsSendRepository.saveAndFlush(elSmsSend);
	}


	@Transactional
	public Page<ElSmsSend> listSmsSendByDevice(int id, Pageable pageable) throws Exception {		

		//TODO de verificat daca userul are acces la acest device
		return elSmsSendRepository.findAllSendMessagesByDevice(id, pageable);
		
	}



}
