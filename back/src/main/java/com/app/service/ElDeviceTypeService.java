package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.app.entity.ElDeviceType;
import com.app.repository.ElDeviceTypeRepository;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
public class ElDeviceTypeService {

	@Autowired
	ElDeviceTypeRepository elDeviceTypeRepository;

	@Transactional
	public Page<ElDeviceType> getDevice(Pageable pageable){
		return elDeviceTypeRepository.findAll(pageable);	
	}

	@Transactional
	public ElDeviceType getOne(int id){
		return elDeviceTypeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Device type not exist!"));
	}

	@Transactional
	public 	List<ElDeviceType> getAllElements() {

		List<ElDeviceType> devices = elDeviceTypeRepository.findAll();

		return devices;		
	}

	@Transactional 
	private void validateEntry(ElDeviceType entry) {
		if(entry.getDeviceTypeName() == null || entry.getDeviceTypeName().isEmpty() || 
				entry.getDeviceTypeDetails() == null || entry.getDeviceTypeDetails().isEmpty() || entry.getIdeologie() == null || entry.getIdeologie().isEmpty()
				|| entry.getLider() == null || entry.getLider().isEmpty() || entry.getMembriiCamDdep() == null || entry.getMembriiCamDdep().isEmpty() ||
				entry.getMembriiParlaEuro() == null || entry.getMembriiParlaEuro().isEmpty() || entry.getMembriiSenat() == null || 
				entry.getMembriiSenat().isEmpty() || entry.getPozitie() == null || entry.getPozitie().isEmpty() || entry.getStatut() == null || entry.getStatut().isEmpty()) {
			throw new IllegalArgumentException("Unul sau mai multe câmpuri sunt nule sau goale! Va rugam sa inserati corect datele.");
		}

	}

	@Transactional
	public ElDeviceType insert(ElDeviceType entry) throws Exception {
		validateEntry(entry);

		List<ElDeviceType> dbElDeviceType = elDeviceTypeRepository.findByDeviceTypeName(entry.getDeviceTypeName());

		if(dbElDeviceType.size() != 0) {
			throw new Exception("Tipul acesta de device cu acest nume exista deja!");
		}

		return elDeviceTypeRepository.saveAndFlush(entry);
	}

	@Transactional
	public ElDeviceType updateDevice(ElDeviceType entity) {

		ElDeviceType device = elDeviceTypeRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device id not found for updating ... "));

		device.setDeviceTypeDetails(entity.getDeviceTypeDetails());
		device.setDeviceTypeName(entity.getDeviceTypeName());
		device.setIdeologie(entity.getIdeologie());
		device.setLider(entity.getLider());
		device.setMembriiCamDdep(entity.getMembriiCamDdep());
		device.setMembriiParlaEuro(entity.getMembriiParlaEuro());
		device.setMembriiSenat(entity.getMembriiSenat());
		device.setPozitie(entity.getPozitie());
		device.setStatut(entity.getStatut());

		return elDeviceTypeRepository.saveAndFlush(device);
	}

	@Transactional
	public ElDeviceType deleteDevice(ElDeviceType entity) {

		ElDeviceType device = elDeviceTypeRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device type id not found for deleting ... "));

		elDeviceTypeRepository.delete(device);
		return device;

	}

}
