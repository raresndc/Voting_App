package com.app.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.DuplicateFormatFlagsException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.entity.ElDevice;
import com.app.entity.ElDeviceType;
import com.app.entity.ElRouter;

import com.app.repository.ElRouterRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
public class ElRouterService {

	@Autowired
	ElRouterRepository elRouterRepository;

	@Transactional
	public Page<ElRouter> getRouter(Pageable pageable){
		return elRouterRepository.findAll(pageable);
	}

	@Transactional
	public ElRouter getOneRouter(int id) {
		return elRouterRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Routerul nu exista!"));
	}


	@Transactional
	public 	List<ElRouter> getAllElements() {

		List<ElRouter> routers = elRouterRepository.findAll();

		return routers;

	}

	@Transactional
	private void validateEntry(ElRouter entry) {
		if (entry.getRouterName() == null || entry.getRouterName().isEmpty() || 
				entry.getRouterDetails() == null || entry.getRouterDetails().isEmpty() ||
				entry.getRouterSyntax() == null || entry.getRouterSyntax().isEmpty() || 
				entry.getRouterIp() == null || entry.getRouterIp().isEmpty() ||
				entry.getRouterUsername() == null || entry.getRouterUsername().isEmpty() || 
				entry.getRouterPassword() == null || entry.getRouterPassword().isEmpty() || entry.getTipRouter() == null || entry.getTipRouter().isEmpty()) {
			throw new IllegalArgumentException("Unul sau mai multe câmpuri sunt nule sau goale! Va rugam sa inserati corect datele.");
		}

		if (elRouterRepository.existsByRouterName(entry.getRouterName())) {
			throw new DataIntegrityViolationException("Un router cu acest nume a fost deja inserat!");
		}

		if(elRouterRepository.existsByRouterIp(entry.getRouterIp())) {
			throw new DataIntegrityViolationException("Un router cu acest ip a fost deja inserat!");
		}

	}

	@Transactional
	private void validateRouterPhone(ElRouter entry) {
		String phoneRegex = "^00407\\d+";
		String regex = "\\d{13}";
		Pattern pattern = Pattern.compile(phoneRegex);
		Matcher matcher = pattern.matcher(entry.getRouterPhone());

		if(elRouterRepository.existsByRouterPhone(entry.getRouterPhone())) {
			throw new DataIntegrityViolationException("Un router cu acest numar de telefon a fost deja inserat!");
		}

		if (entry.getRouterPhone() == null || entry.getRouterPhone().isEmpty()) {
			throw new IllegalArgumentException("Numărul de telefon al routerului este necesar");
		}

		if(!matcher.matches()) {
			throw new IllegalArgumentException("Numarul de telefon introdus este incorect! Va rugam introduceti un numar de telefon valid de genul '07xxxxxx' ");
		}

		if(!Pattern.matches(regex, entry.getRouterPhone())) {
			throw new IllegalArgumentException("Numarul de telefon introdus este incorect! Va rugam introduceti un numar de telefon continant 10 cifre");
		}

	}

	@Transactional 
	private void validateRouterIp(ElRouter entry) {
		String ipRegex = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
				+ "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
				+ "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
				+ "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$";

		Pattern pattern = Pattern.compile(ipRegex);

		if(!Pattern.matches(ipRegex, entry.getRouterIp())) {
			throw new IllegalArgumentException("Ip-ul introdus are un format incorect! Introduceti un ip de forma xxx.xxx.xxx.xxx");
		}
	}

	@Transactional
	public ElRouter save(ElRouter entry) {

		validateEntry(entry);

		validateRouterPhone(entry);

		validateRouterIp(entry);

		return elRouterRepository.saveAndFlush(entry);
	}


	@Transactional
	public ElRouter updateRouter(ElRouter entity) {


		ElRouter router = elRouterRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Router id not found for updating ... "));

		router.setRouterDetails(entity.getRouterDetails());
		router.setRouterIp(entity.getRouterIp());
		router.setRouterName(entity.getRouterName());
		router.setRouterPassword(entity.getRouterPassword());
		router.setRouterUsername(entity.getRouterUsername());
		router.setRouterSyntax(entity.getRouterSyntax());	    
		router.setRouterPhone(entity.getRouterPhone());
		router.setTipRouter(entity.getTipRouter());

		return elRouterRepository.saveAndFlush(router);
	}

	@Transactional
	public ElRouter deleteRouter(ElRouter entity) {

		ElRouter router = elRouterRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Router id not found for deleting ... "));

		elRouterRepository.delete(router);
		return router;

	}


}

