package com.app.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import com.app.controller.dao.DeleteUserDevice;
import com.app.entity.ElDevice;
import com.app.entity.ElDeviceType;
import com.app.entity.ElRouter;
import com.app.repository.ElDeviceRepository;
import com.app.repository.ElDeviceTypeRepository;
import com.app.repository.ElRouterRepository;
import com.auth.config.UsersRoles;
import com.auth.entity.User;
import com.auth.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
public class ElDeviceService {

	@Autowired
	ElDeviceRepository elDeviceRepository;

	@Autowired
	ElDeviceTypeRepository elDeviceTypeRepository;

	@Autowired
	ElRouterRepository elRouterRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	TeltonikaSmsService teltonikaSmsService;

	@Transactional
	public Page<ElDevice> getDevice(Pageable pageable){
		return elDeviceRepository.findAll(pageable);

	}

	@Transactional
	public Page<ElDevice> getDevicesByUsername(String username,Pageable pageable) throws Exception{

		User dbUser = userRepository.findByUsername(username);

		if(dbUser == null) 
			throw new Exception("Utilizatorul nu exista!");

		Page<ElDevice> page = new PageImpl<ElDevice>(dbUser.getDevices(), pageable, dbUser.getDevices().size());

		return page;
	}
	



	@Transactional
	public void assignUserToDevice(String username, ElDevice device) throws Exception {

		User dbUser = userRepository.findByUsername(username);

		if(dbUser == null) 
			throw new Exception("Utilizatorul nu exista!");

		if(dbUser.getRoles().stream().filter( x -> x.getName().equals(UsersRoles.USER) | x.getName().equals(UsersRoles.GUEST)).count() == 0) 
			throw new Exception("Acest utilizator are deja toate drepturile alocate");

		ElDevice dbElDevice = elDeviceRepository.findById(device.getId()).orElseThrow(() -> new EntityNotFoundException("Device nu a fost gasit!"));

		dbUser.addDevice(dbElDevice);
		dbElDevice.addUser(dbUser);

		elDeviceRepository.saveAndFlush(dbElDevice);

	}


	@Transactional
	public 	List<ElDevice> getAllElements() {
		return elDeviceRepository.findAll();
	}

	@Transactional
	public ElDevice getOne(int id){
		return elDeviceRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Device not exist!"));
	}



	@Transactional
	public void changePassword(ElDevice deviceDb, String oldPassword, String password) throws Exception {
		ElDevice device = elDeviceRepository.findById(deviceDb.getId()).orElseThrow(() -> new IllegalArgumentException("Device not found"));
		String regex = "^[0-9]{4}$";

		if(!Pattern.matches(regex, password) || !Pattern.matches(regex, oldPassword)){
			throw new IllegalArgumentException("Parola veche sau noua introdusa incorect! Introduceti o parola formata din 4 cifre!");
		}

		elDeviceRepository.save(device);

		teltonikaSmsService.sendSms(device.getDeviceMsisdn(), URLEncoder.encode("#04#" + oldPassword +"#" + password +"#", StandardCharsets.UTF_8.toString()), device.getMasterRouter().getRouterIp());

	}


	@Transactional
	public ElDevice updateDevice(ElDevice entity) throws Exception {

		ElDevice device = elDeviceRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device not found"));

		ElDevice dbDevice = elDeviceRepository.findByDeviceMsisdn(entity.getDeviceMsisdn());
			
			if(dbDevice != null) {
				throw new Exception("Un device cu acest numar de telefon exista deja!");
			}
		
		
		device.setDeviceDetails(entity.getDeviceDetails());
		device.setDeviceLocation(entity.getDeviceLocation());
		device.setDeviceMsisdn(entity.getDeviceMsisdn());
		device.setDeviceName(entity.getDeviceName());
	

		return elDeviceRepository.saveAndFlush(device);
	}



	@Transactional
	private void validateEntry(ElDevice entry) {
		if(entry.getDeviceDetails() == null || entry.getDeviceDetails().isEmpty() ||
				entry.getDeviceLocation() == null || entry.getDeviceLocation().isEmpty() ||
				entry.getDeviceMsisdn() == null || entry.getDeviceMsisdn().isEmpty() ||
				entry.getDeviceName() == null || entry.getDeviceName().isEmpty() ) {

			throw new IllegalArgumentException("Unul sau mai multe câmpuri sunt nule sau goale! Va rugam sa inserati corect datele.");
		}
	}



	@Transactional
	public void save(ElDevice entry) throws Exception {

		ElDeviceType devicetype = elDeviceTypeRepository.findById(entry.getElDeviceType().getId()).orElseThrow(() -> new EntityNotFoundException("Device not found"));
		ElDevice device = elDeviceRepository.findByDeviceNameOrDevicePhone(entry.getDeviceName(), entry.getDevicePhone());

		if(device != null) {
			throw new Exception("Dispozitivul cu acest nume sau acest numar de telefon este deja inrolat! / Dispozitivul inrolat nu are un nume sau numar de telefon valid");
		}

		List<ElRouter> routerList = elRouterRepository.findAllDeviceRouters();

//		if(routerList.size() < 1) {
//			throw new Exception("Eroare. Nu se poate inrola dispozitivul pentru ca nu exista routere disponibile! Contactacti admininstratorului!");
//		}
//
//		if(routerList.size() == 1) {
//			entry.setMasterRouter(routerList.get(0));
//		} else {
//
//			ElRouter mastElRouter = witchRouterIsBetterForBeeingMaster(routerList);
//
//			ElRouter userRouter = witchRouterIsBetterForBeeingUser(routerList.stream().filter(x -> x.getId() != mastElRouter.getId()).collect(Collectors.toList()));
//
//
//			entry.setMasterRouter(mastElRouter);
//			entry.setElRouter(userRouter);
//
//		}

		validateEntry(entry);

		entry.setElDeviceType(devicetype);
		elDeviceRepository.saveAndFlush(entry);

//		teltonikaSmsService.sendSms(entry.getDeviceMsisdn(), URLEncoder.encode("#00#", StandardCharsets.UTF_8.toString()), entry.getMasterRouter().getRouterIp());

	}

	@Transactional
	public ElDevice getDeviceById(int id) {
		return elDeviceRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Priza nu exista!"));

	}

	@Transactional
	private ElRouter witchRouterIsBetterForBeeingUser(List<ElRouter> routerList) {

		int smallestIndexUser = 0;
		int smallestSizeUser = Integer.MAX_VALUE;

		for (int i = 0; i < routerList.size(); i++) {
			ElRouter router = routerList.get(i);
			List<ElDevice> elUser = router.getElUser();
			int elUserSize = elUser.size();

			if (elUserSize < smallestSizeUser) {
				smallestSizeUser = elUserSize;
				smallestIndexUser = i;
			}
		}

		return routerList.get(smallestIndexUser);
	}

	@Transactional
	private ElRouter witchRouterIsBetterForBeeingMaster(List<ElRouter> routerList) {

		int smallestIndexSlave = 0;
		int smallestSizeSlave = Integer.MAX_VALUE;

		for (int i = 0; i < routerList.size(); i++) {
			ElRouter router = routerList.get(i);
			List<ElDevice> elSlaves = router.getElSlaves();
			int elSlavesSize = elSlaves.size();

			if (elSlavesSize < smallestSizeSlave) {
				smallestSizeSlave = elSlavesSize;
				smallestIndexSlave = i;
			}
		}

		return routerList.get(smallestIndexSlave);
	}

	@Transactional
	public ElDevice deleteById(ElDevice entity) throws Exception {
		ElDevice id = elDeviceRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device not found"));

		if (id.isMasterActivated() == true)
			throw new Exception("Poti sterge priza doar daca nu are master setat! Realizati factory reset in prealabil daca doriti stergerea prizei!");

		elDeviceRepository.delete(id);
		return id;
	}
	
	

	@Transactional
	public ElDevice deleteRouterUserById(ElDevice entity) throws Exception{
		ElDevice id = elDeviceRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device not found"));

		if(id.isUserActivated() == true) {
			teltonikaSmsService.sendSms(id.getDeviceMsisdn(), URLEncoder.encode("#15#" + id.getElRouter().getRouterPhone() +"#", StandardCharsets.UTF_8.toString()), id.getMasterRouter().getRouterIp());
		}else throw new Exception("Priza selectata nu are niciun router cu rol de user pe care sa il stergeti");

		return id;
	}
	
	

	@Transactional 
	public ElDevice setRouterUser(ElDevice entity) throws Exception{

		List<ElRouter> routerList = elRouterRepository.findAllDeviceRouters();

		if(routerList.size() < 1) {
			throw new Exception("Eroare. Nu se poate inrola dispozitivul pentru ca nu exista routere disponibile! Contactacti admininstratorului!");
		}

		ElDevice dbEntity = elDeviceRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device not found"));

		if(dbEntity.isMasterActivated() == false) {
			throw new Exception("Alocati prima data prizei un master pentru a putea aloca un user!");
		}

		if(dbEntity.isUserActivated() == true) {
			throw new Exception("Priza are deja un user alocat! Resetati priza daca doriti sa-i schimbati masterul");
		}



		if(routerList.size() == 1) {
			throw new Exception ("Nu exista niciun router eligibil pentru a putea a avea rolul de utilizator");
		} else {

			ElRouter userRouter = witchRouterIsBetterForBeeingUser(routerList.stream().filter(x -> x.getId() != dbEntity.getMasterRouter().getId()).collect(Collectors.toList()));

			teltonikaSmsService.sendSms(dbEntity.getDeviceMsisdn(), URLEncoder.encode("#06#" + userRouter.getRouterPhone().substring(3) +"#", StandardCharsets.UTF_8.toString()), dbEntity.getMasterRouter().getRouterIp());

			dbEntity.setElRouter(userRouter);

		}
		elDeviceRepository.saveAndFlush(dbEntity);
		return dbEntity;

	}

	@Transactional 
	public ElDevice setRouterMaster(ElDevice entity) throws Exception{

		List<ElRouter> routerList = elRouterRepository.findAllDeviceRouters();

		if(routerList.size() < 1) {
			throw new Exception("Eroare. Nu se poate inrola dispozitivul pentru ca nu exista routere disponibile! Contactacti admininstratorului!");
		}

		ElDevice dbEntity = elDeviceRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Device not found"));


		if(dbEntity.isMasterActivated() == true) {
			throw new Exception("Priza are deja un master alocat! Resetati priza daca doriti sa-i schimbati masterul");
		}


		if(routerList.size() == 1) {
			entity.setMasterRouter(routerList.get(0));
		} else {

			ElRouter mastElRouter = witchRouterIsBetterForBeeingMaster(routerList);

			teltonikaSmsService.sendSms(dbEntity.getDeviceMsisdn(), URLEncoder.encode("#00#", StandardCharsets.UTF_8.toString()), mastElRouter.getRouterIp());

			dbEntity.setMasterRouter(mastElRouter);

		}

		elDeviceRepository.saveAndFlush(dbEntity);
		return dbEntity;

	}

	@Transactional
	public void resetById(ElDevice deviceId, String password) throws Exception{
		ElDevice device = elDeviceRepository.findById(deviceId.getId()).orElseThrow(() -> new IllegalArgumentException("Device not found"));

		if (device.isMasterActivated() == true) {
			String regex = "^[0-9]{4}$";

			if(!Pattern.matches(regex, password)){
				throw new IllegalArgumentException("Formatul Parolei este incorect! Introduceti o parola formata din 4 cifre!");
			} 

			teltonikaSmsService.sendSms(device.getDeviceMsisdn(), URLEncoder.encode("#08#" + password +"#", StandardCharsets.UTF_8.toString()), device.getMasterRouter().getRouterIp());

		}


	}

	@Transactional
	public String getPhoneNumberByDeviceName(String devicetName) {
		ElDevice device = elDeviceRepository.findByDeviceName(devicetName);
		if(device == null) {
			return null;
		}
		return device.getDeviceMsisdn();
	}

	@Transactional
	public void deleteAllDevicesForUser(User user) {

		User dbUser = userRepository.findByUsername(user.getUsername());

		List<ElDevice> devices = elDeviceRepository.findAll();

		for(ElDevice device : devices) {
			if(device.containsUser(dbUser)) {
				device.removeUser(user);
				elDeviceRepository.saveAndFlush(device);
			}
		}
	}

	@Transactional
	public void deleteUserDevice (DeleteUserDevice deviceUser) {

		User dbUser = userRepository.findByUsername(deviceUser.username);
		ElDevice device = elDeviceRepository.findById(deviceUser.device.getId()).orElseThrow(() -> new IllegalArgumentException("Device not found"));

		device.removeUser(dbUser);
		elDeviceRepository.saveAndFlush(device);

	}


}




