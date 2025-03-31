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
import com.app.service.ElDeviceTypeService;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.model.ResponseUser;


@RequestMapping("/device-type")
@Controller
@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
public class ElDeviceTypeController {

	@Value("${server.port}")
	private int port;

	@Autowired
	AuditService auditServie;

	@Autowired
	private RoleVerification rolveVerification;

	@Autowired
	ElDeviceTypeService elDeviceTypeService;

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
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
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

			return new ResponseEntity<Object>(elDeviceTypeService.getDevice(pageable), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getOne")
	@ResponseBody
	public ResponseEntity<Object> getOne(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestParam(defaultValue = "0") final Integer id,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST_ONE.toString(),
						null,
						AuditFormats.Entity.DEVICE_TYPE.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			return new ResponseEntity<Object>(elDeviceTypeService.getOne(id), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/save")
	@ResponseBody ResponseEntity<Object> saveDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDeviceType req,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);

			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.CREATE.toString(),
						req.toString(),
						AuditFormats.Entity.DEVICE_TYPE.toString(),
						req.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			//TODO de verificat parametrii obligatorii

			elDeviceTypeService.insert(req);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.CREATE.toString(),
					req.toString(),
					AuditFormats.Entity.DEVICE_TYPE.toString(),
					req.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/update")
	@ResponseBody ResponseEntity<Object> updateDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDeviceType newDevice,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);

			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.UPDATE.toString(),
						newDevice.toString(),
						AuditFormats.Entity.DEVICE_TYPE.toString(),
						newDevice.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElDeviceType updatedDevice = elDeviceTypeService.updateDevice(newDevice);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.UPDATE.toString(),
					newDevice.toString(),
					AuditFormats.Entity.DEVICE_TYPE.toString(),
					newDevice.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(updatedDevice, HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}



	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	@ResponseBody ResponseEntity<Object> deleteDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDeviceType newDevice,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);

			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE.toString(),
						newDevice.toString(),
						AuditFormats.Entity.DEVICE_TYPE.toString(),
						newDevice.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			elDeviceTypeService.deleteDevice(newDevice);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.DELETE.toString(),
					newDevice.toString(),
					AuditFormats.Entity.DEVICE_TYPE.toString(),
					newDevice.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}

