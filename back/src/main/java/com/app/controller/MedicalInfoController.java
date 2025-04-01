package com.app.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ElectraApplication;
import com.app.entity.ElDeviceType;
import com.app.entity.MedicalInfo;
import com.app.service.MedicalInfoService;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.model.ResponseUser;

@RequestMapping("/medical-info")
@Controller
@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
public class MedicalInfoController {

	@Value("${server.port}")
	private int port;
	
	@Autowired
	AuditService auditServie;
	
	@Autowired
	MedicalInfoService medicalInfoService;
	
	@Autowired
	private RoleVerification rolveVerification;
	
	@RequestMapping(method = RequestMethod.GET, value = "/all")
	@ResponseBody
	public ResponseEntity<Object> getAllDevices(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer pageSize,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
//						UsersRoles.ADMIN_USERS, 
						UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.ADMIN_USERS);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						null,
						AuditFormats.Entity.DEVICE_TYPE.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			Pageable pageable = PageRequest.of(pageIndex, pageSize);

			return new ResponseEntity<Object>(medicalInfoService.getMedical(pageable), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@RequestMapping(method = RequestMethod.POST, value = "/save")
	@ResponseBody ResponseEntity<Object> saveMedical(

			@RequestBody MedicalInfo req,
			HttpServletRequest request) {
		try {

			try {


			} catch (Exception e) {



				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			//TODO de verificat parametrii obligatorii

			medicalInfoService.insert(req);


			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	@ResponseBody ResponseEntity<Object> deleteMedical(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody MedicalInfo newMedical,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
//						UsersRoles.ADMIN_USERS, 
						UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.ADMIN_USERS);

			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE.toString(),
						newMedical.toString(),
						AuditFormats.Entity.DEVICE_TYPE.toString(),
						newMedical.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			medicalInfoService.deleteMedical(newMedical);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.DELETE.toString(),
					newMedical.toString(),
					AuditFormats.Entity.DEVICE_TYPE.toString(),
					newMedical.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	
}
