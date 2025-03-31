package com.app.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.ElectraApplication;
import com.app.controller.dao.DeleteUserDevice;
import com.app.controller.dao.DevicePassword;
import com.app.controller.dao.RequestAssignUserToDevice;
import com.app.entity.ElDevice;
import com.app.service.ElDeviceService;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.model.ResponseUser;

@RequestMapping("/device")
@RestController
@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
public class ElDeviceController {

	@Autowired
	ElDeviceService elDeviceService;

	@Value("${server.port}")
	private int port;

	@Autowired
	AuditService auditServie;

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

			String role = null;

			try {
				role = rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.USER, UsersRoles.SUPER_USER, UsersRoles.ADMIN_USERS, UsersRoles.GUEST, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						null,
						AuditFormats.Entity.DEVICE.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			Pageable pageable = PageRequest.of(pageIndex, pageSize);

			if(role.equals(UsersRoles.ADMIN_USERS) || role.equals(UsersRoles.SUPER_USER) || role.equals(UsersRoles.USER)) {
				return new ResponseEntity<Object>(elDeviceService.getDevice(pageable), HttpStatus.OK);
			} else {
				return new ResponseEntity<Object>(elDeviceService.getDevicesByUsername(username, pageable), HttpStatus.OK);
			}

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
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.USER, UsersRoles.GUEST);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST_ONE.toString(),
						null,
						AuditFormats.Entity.DEVICE.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}
			return new ResponseEntity<Object>(elDeviceService.getOne(id), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/save")
	@ResponseBody
	ResponseEntity<Object> saveOutlet(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDevice device,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.CREATE.toString(),
						device.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						device.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			elDeviceService.save(device);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.CREATE.toString(),
					device.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					device.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/update")
	@ResponseBody ResponseEntity<Object> updateOutlet(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDevice newDevice,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.UPDATE.toString(),
						newDevice.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						newDevice.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElDevice updatedOutlet = elDeviceService.updateDevice(newDevice);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.UPDATE.toString(),
					newDevice.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					newDevice.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(updatedOutlet, HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}


	@RequestMapping(method = RequestMethod.POST, value = "/update-pass")
	@ResponseBody
	public ResponseEntity<Object> updateOutlet(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody DevicePassword req,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port,
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.UPDATE_PASS.toString(),
						req.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						req.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.UNAUTHORIZED);
			}

			elDeviceService.changePassword(req.device, req.oldPassword, req.password);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.UPDATE_PASS.toString(),
					req.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					req.toString(),
					username,
					WebUtils.getRequestIP(request));;

					return new ResponseEntity<>(HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(new ResponseUser("0", e.getMessage()), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<>(new ResponseUser("0", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	@ResponseBody ResponseEntity<Object> deleteById(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDevice delDevice,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE.toString(),
						delDevice.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						delDevice.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.UNAUTHORIZED);
			}

			elDeviceService.deleteById(delDevice);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.DELETE.toString(),
					delDevice.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					delDevice.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}


	@RequestMapping(method = RequestMethod.POST, value = "/delete-router-user")
	@ResponseBody ResponseEntity<Object> deleteRouterUserById(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDevice delDevice,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE_ROUTER_USER.toString(),
						delDevice.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						delDevice.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElDevice deletedUserRole = elDeviceService.deleteRouterUserById(delDevice);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.DELETE_ROUTER_USER.toString(),
					delDevice.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					delDevice.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(deletedUserRole, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}


	@RequestMapping(method = RequestMethod.POST, value = "/assign-router-user")
	@ResponseBody ResponseEntity<Object> setRouterUser(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDevice userRouter,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.ASSIGN_ROUTER_USER.toString(),
						userRouter.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						userRouter.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElDevice assignRouterUser = elDeviceService.setRouterUser(userRouter);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.ASSIGN_ROUTER_USER.toString(),
					userRouter.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					userRouter.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(assignRouterUser, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@RequestMapping(method = RequestMethod.POST, value = "/assign-router-master")
	@ResponseBody ResponseEntity<Object> setRouterMaster(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElDevice masterRouter,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.ASSIGN_ROUTER_MASTER.toString(),
						masterRouter.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						masterRouter.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElDevice assignRouterMaster = elDeviceService.setRouterMaster(masterRouter);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.ASSIGN_ROUTER_MASTER.toString(),
					masterRouter.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					masterRouter.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(assignRouterMaster, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}



	@RequestMapping(method = RequestMethod.POST, value = "/reset")
	@ResponseBody ResponseEntity<Object> resetById(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody DevicePassword req,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.RESET.toString(),
						req.toString(),
						AuditFormats.Entity.DEVICE.toString(),
						req.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			elDeviceService.resetById(req.device, req.password);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.RESET.toString(),
					req.toString(),
					AuditFormats.Entity.DEVICE.toString(),
					req.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	@RequestMapping(method = RequestMethod.POST, value = "/assign-user-device")
	@ResponseBody
	ResponseEntity<Object> assignUserToDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestAssignUserToDevice req,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.ASSIGN_USER_DEVICE.toString(),
						req.toString(),
						AuditFormats.Entity.DEVICE_USER.toString(),
						req.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			elDeviceService.assignUserToDevice(req.username, req.elDevice);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.ASSIGN_USER_DEVICE.toString(),
					req.toString(),
					AuditFormats.Entity.DEVICE_USER.toString(),
					req.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	@RequestMapping(method = RequestMethod.POST, value = "/delete-user-device")
	@ResponseBody
	ResponseEntity<Object> deleteUserDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody DeleteUserDevice req,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE_USER_DEVICE.toString(),
						req.toString(),
						AuditFormats.Entity.DEVICE_USER.toString(),
						req.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			elDeviceService.deleteUserDevice(req);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.DELETE_USER_DEVICE.toString(),
					req.toString(),
					AuditFormats.Entity.DEVICE_USER.toString(),
					req.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




}
