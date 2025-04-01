package com.app.service;

import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.entity.ElDeviceType;
import com.app.entity.MedicalInfo;
import com.app.repository.MedicalInfoRepository;

@Service
public class MedicalInfoService {

	@Autowired
	MedicalInfoRepository medicalInfoRepository;
	
	@Transactional
	public Page<MedicalInfo> getMedical(Pageable pageable){
		return medicalInfoRepository.findAll(pageable);	
	}

	@Transactional
	public MedicalInfo getOne(int id){
		return medicalInfoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("This medical info does not exist!"));
	}
	

	@Transactional
	public 	List<MedicalInfo> getAllElements() {

		List<MedicalInfo> medical = medicalInfoRepository.findAll();

		return medical;		
	}

	@Transactional 
	private void validateEntry(MedicalInfo entry) throws Exception {
		
		if(entry.getName() == null || entry.getName().isEmpty() ||
				entry.getPrenume() == null || entry.getPrenume().isEmpty() ||
				entry.getUsername() == null || entry.getUsername().isEmpty() ||
				entry.getGender() == null || entry.getGender().isEmpty() ||
				entry.getGrupaSanguina() == null || entry.getGrupaSanguina().isEmpty() ||
				entry.getHeight() == null || entry.getHeight().isEmpty() || 
				entry.getWeight() == null || entry.getWeight().isEmpty() ||
				entry.getCetatenie() == null || entry.getCetatenie().isEmpty() ||
				entry.getTara() == null || entry.getTara().isEmpty() ||
				entry.getJudet() == null || entry.getJudet().isEmpty() ||
				entry.getLocalitate() == null || entry.getLocalitate().isEmpty() ||
				entry.getAdresa() == null || entry.getAdresa().isEmpty()) {
			throw new IllegalArgumentException("Unul sau mai multe câmpuri sunt nule sau goale! Va rugam sa inserati corect datele.");

		}
		
	    // Validate phone number (assuming it should contain only digits and have a specific length)
	    if (entry.getPacientPhoneNumber() == null || entry.getPacientPhoneNumber().isEmpty() ||
	        !entry.getPacientPhoneNumber().matches("^[0-9]{10}$")) {
	        throw new Exception("Phone number is not valid. Please use a 10-digit phone number.");
	        
	    }

	    // Validate CNP (assuming it should have exactly 13 characters and contain only digits)
	    if (entry.getCnp() == null || entry.getCnp().isEmpty() ||
	        !entry.getCnp().matches("^[1-9]\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])(0[1-9]|[1-4]\\d|5[0-2]|99)(00[1-9]|0[1-9]\\d|[1-9]\\d\\d)\\d$")) {
	        throw new Exception("CNP is not valid. Please use a 13-digit valid CNP.");
	    }
	    
	    // Validate email address separately
	    if (entry.getEmail() == null || entry.getEmail().isEmpty()) {
	        throw new IllegalArgumentException("Email address is required.");
	    } else if (!entry.getEmail().matches("^[A-Za-z0-9+_.-]+@yahoo\\.com$") &&
	               !entry.getEmail().matches("^[A-Za-z0-9+_.-]+@gmail\\.com$") && 
	               !entry.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
	        throw new Exception("Email address is not valid. Please use a valid @yahoo.com or @gmail.com address.");
	    }
	    
	    // Validate birthday and age
	    if (entry.getBirthday() == null) {
	        throw new IllegalArgumentException("Birthday is required.");
	    }

	    if (entry.getAge() == null || entry.getAge() < 0) {
	        throw new IllegalArgumentException("Age is not valid. Please provide a valid age.");
	    }

	}
	
	
	@Transactional
	public MedicalInfo insert(MedicalInfo entry) throws Exception {

		validateEntry(entry);
		return medicalInfoRepository.saveAndFlush(entry);
	}
	
	@Transactional
	public MedicalInfo deleteMedical(MedicalInfo entity) {

		MedicalInfo medical = medicalInfoRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Pacient id not found for deleting ... "));

		medicalInfoRepository.delete(medical);
		return medical;

	}
	
	
}
