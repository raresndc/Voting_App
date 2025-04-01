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
import com.app.controller.dao.CreateCommand;
import com.app.entity.ElCmd;
import com.app.service.ElCmdService;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.model.ResponseUser;

@RequestMapping("/cmd")
@Controller
@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
public class ElCmdController {

	@Value("${server.port}")
	private int port;

	@Autowired
	ElCmdService elCmdService;

	@Autowired
	AuditService auditServie;

	@Autowired
	private RoleVerification rolveVerification;

	@RequestMapping(method = RequestMethod.GET, value = "/all")
	@ResponseBody
	public ResponseEntity<Object> getAllCmd(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer pageSize, 
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						null,
						AuditFormats.Entity.DEVICE_CMD.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElectraApplication.logger.info("All Commands are OK to view");

			Pageable pageable = PageRequest.of(pageIndex, pageSize);

			return new ResponseEntity<Object>(elCmdService.getCmd(pageable), HttpStatus.OK);
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
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST_ONE.toString(),
						null,
						AuditFormats.Entity.DEVICE_CMD.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			return new ResponseEntity<Object>(elCmdService.getOne(id), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/save")
	@ResponseBody ResponseEntity<Object> saveCmd(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody CreateCommand cmd,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
					 UsersRoles.SUPER_USER);
			} catch (Exception e) {
				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.CREATE.toString(),
						cmd.toString(),
						AuditFormats.Entity.DEVICE_CMD.toString(),
						cmd.toString(),
						username,
						WebUtils.getRequestIP(request));
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			elCmdService.save(cmd);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.CREATE.toString(),
					cmd.toString(),
					AuditFormats.Entity.DEVICE_CMD.toString(),
					cmd.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/update")
	@ResponseBody ResponseEntity<Object> updateCmd(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,

			@RequestBody ElCmd newCmd, 
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SUPER_USER);

			} catch (Exception e) {
				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.UPDATE.toString(),
						newCmd.toString(),
						AuditFormats.Entity.DEVICE_CMD.toString(),
						newCmd.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElCmd updatedCmd = elCmdService.updateCmd(newCmd);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.UPDATE.toString(),
					newCmd.toString(),
					AuditFormats.Entity.DEVICE_CMD.toString(),
					newCmd.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(updatedCmd, HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	@ResponseBody ResponseEntity<Object> deleteById(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElCmd delCmd,
			HttpServletRequest request){
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE.toString(),
						delCmd.toString(),
						AuditFormats.Entity.DEVICE_CMD.toString(),
						delCmd.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElCmd deletedOutlet = elCmdService.deleteById(delCmd);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.DELETE.toString(),
					delCmd.toString(),
					AuditFormats.Entity.DEVICE_CMD.toString(),
					delCmd.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(deletedOutlet, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
