package com.app.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import com.ElectraApplication;
import com.app.controller.dao.SendSmsDao;
import com.app.entity.ElCmd;
import com.app.entity.ElDevice;
import com.app.service.ElCmdService;
import com.app.service.ElDeviceService;
import com.app.service.ElSmsReceivedService;
import com.app.service.ElSmsSendService;
import com.app.service.TeltonikaSmsService;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.entity.User;
import com.auth.model.ResponseUser;
import com.auth.service.AccountsService;
import com.auth.service.CustomUserDetailsService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/sms")
@RestController
@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
public class SmsController {

	@Value("${server.port}")
	private int port;

	@Autowired
	private ElDeviceService elDeviceService;

	@Autowired
	private ElCmdService elCmdService;

	@Autowired
	private RoleVerification rolveVerification;

	@Autowired
	private TeltonikaSmsService smsService;

	@Autowired
	private ElSmsSendService elSmsSendService;

	@Autowired
	ElSmsReceivedService elSmsReceivedService;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Autowired
	AuditService auditServie;


	@RequestMapping(method = RequestMethod.POST, value = "/send")
	@ResponseBody
	public ResponseEntity<Object> sendSms(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody SendSmsDao req,
			HttpServletRequest request) {
		try {
			
			User user = (User) customUserDetailsService.loadUserByUsername(username);

			if(user.getRoles().stream().filter(x -> x.getName().contains(UsersRoles.SUPER_USER) ||
					x.getName().contains(UsersRoles.ADMIN_USERS) ||
					x.getName().contains(UsersRoles.SISTEM_ADMIN)
					).count() == 0) {
				
				boolean hasDevice = user.getDevices().stream()
						.anyMatch(device -> device.getId() == req.elDevice.getId());

				if (!hasDevice) {
					throw new Exception("Acest user nu are acces la priza selectata");
				}
				
			}
			


			ElDevice dbDevice = elDeviceService.getDeviceById(req.elDevice.getId());
			ElCmd dbCmd = elCmdService.getCmdById(req.elCmd.getId());
			String messageSyntax = elCmdService.getMessageSyntax(req.temperatureInterval, dbCmd);
			
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port,
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {


				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.SEND.toString(),
						req.toString(),
						AuditFormats.Entity.SMS_SEND.toString(),
						req.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0", e.getMessage()), HttpStatus.UNAUTHORIZED);
			}

			try {
				smsService.sendSms(dbDevice.getDeviceMsisdn(), messageSyntax, dbDevice.getMasterRouter().getRouterIp());
			} catch (Exception e) {
				smsService.sendSms(dbDevice.getDeviceMsisdn(), messageSyntax, dbDevice.getElRouter().getRouterIp());
			}

			elSmsSendService.saveSmsSend(req, username);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.SEND.toString(),
					req.toString(),
					AuditFormats.Entity.SMS_SEND.toString(),
					req.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<>(new ResponseUser("0", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.GET, value = "/getAllSendMessagesByDevice")
	@ResponseBody
	public ResponseEntity<Object> getAllSendMessagesByDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer pageSize,
			@RequestParam(defaultValue = "0") final Integer deviceId,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.GUEST);
			} catch (Exception e) {


				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST_BY.toString(),
						null,
						AuditFormats.Entity.SMS_SEND.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0", e.getMessage()), HttpStatus.UNAUTHORIZED);

			}

			ElectraApplication.logger.info("All Commands are OK to view");

			Pageable pageable = PageRequest.of(pageIndex, pageSize);
			return new ResponseEntity<Object>(elSmsSendService.listSmsSendByDevice(deviceId, pageable), HttpStatus.OK);

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<>("SMS sent successfully", HttpStatus.OK);
		}
	}


	@RequestMapping(method = RequestMethod.GET, value = "/getAllReceivedMessagesByDevice")
	@ResponseBody
	public ResponseEntity<Object> getAllReceivedMessagesByDevice(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,

			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer pageSize,
			@RequestParam(defaultValue = "0") final Integer deviceId,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.GUEST);
			} catch (Exception e) {
				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST_BY.toString(),
						null,
						AuditFormats.Entity.SMS_RECEIVER.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0", e.getMessage()), HttpStatus.UNAUTHORIZED);
			}

			ElectraApplication.logger.info("All Commands are OK to view");

			Pageable pageable = PageRequest.of(pageIndex, pageSize);
			return new ResponseEntity<Object>(elSmsReceivedService.listSmsReceivedByDevice(deviceId, pageable), HttpStatus.OK);

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<>("SMS sent successfully", HttpStatus.OK);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/received-messages-all")
	@ResponseBody
	public ResponseEntity<Object> getAllSmsMessage(
			//public Page<ElOutlet>getAlDevices(		
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,

			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer size,
			
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.GUEST, UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			}catch (Exception e) {
				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						null,
						AuditFormats.Entity.SMS_RECEIVER.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0", e.getMessage()), HttpStatus.UNAUTHORIZED);
			}
			Pageable pageable = PageRequest.of(pageIndex, size);

			return new ResponseEntity<Object>(elSmsReceivedService.getSmsMessage(pageable), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<>("SMS sent successfully", HttpStatus.OK);
		}
	}


	@RequestMapping(method = RequestMethod.GET, value = "/sent-messages-all")
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
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.GUEST);
			} catch (Exception e) {
				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						null,
						AuditFormats.Entity.SMS_SEND.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0", e.getMessage()), HttpStatus.UNAUTHORIZED);
			}

			ElectraApplication.logger.info("All Commands are OK to view");

			Pageable pageable = PageRequest.of(pageIndex, pageSize);

			return new ResponseEntity<Object>(elSmsSendService.getSmsSend(pageable), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<>("SMS sent successfully", HttpStatus.OK);
		}
	}

}
