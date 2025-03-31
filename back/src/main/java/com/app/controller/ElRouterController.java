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
import com.app.entity.ElRouter;
import com.app.service.ElRouterService;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.model.ResponseUser;


@RequestMapping("/router")
@Controller
@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
public class ElRouterController {

	@Value("${server.port}")
	private int port;

	@Autowired
	AuditService auditServie;

	@Autowired
	private RoleVerification rolveVerification;

	@Autowired
	ElRouterService elRouterService;

	@RequestMapping(method = RequestMethod.GET, value = "/all")
	@ResponseBody
	public ResponseEntity<Object> getAllRouters(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer pageSize,
			HttpServletRequest request) {
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.USER, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN, UsersRoles.GUEST, UsersRoles.ADMIN_USERS);

			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						null,
						AuditFormats.Entity.ROUTER.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			Pageable pageable = PageRequest.of(pageIndex, pageSize);

			return new ResponseEntity<Object>(elRouterService.getRouter(pageable), HttpStatus.OK);
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
						UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);

			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST_ONE.toString(),
						null,
						AuditFormats.Entity.ROUTER.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			return new ResponseEntity<Object>(elRouterService.getOneRouter(id), HttpStatus.OK);

		} catch (Exception e) {

			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/save")
	@ResponseBody ResponseEntity<Object> saveRouter(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElRouter router,
			HttpServletRequest request) {
		try {


			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SISTEM_ADMIN, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.CREATE.toString(),
						router.toString(),
						AuditFormats.Entity.ROUTER.toString(),
						router.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}


			elRouterService.save(router);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.CREATE.toString(),
					router.toString(),
					AuditFormats.Entity.ROUTER.toString(),
					router.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(null, HttpStatus.CREATED);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/update")
	public ResponseEntity<Object> updateRouter(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElRouter newRouter,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SISTEM_ADMIN, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.UPDATE.toString(),
						newRouter.toString(),
						AuditFormats.Entity.ROUTER.toString(),
						newRouter.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}


			ElRouter updatedRouter = elRouterService.updateRouter(newRouter);

			auditServie.createLogSucces(AuditFormats.Acces.GRANTED.toString(),
					AuditFormats.Event.UPDATE.toString(),
					newRouter.toString(),
					AuditFormats.Entity.ROUTER.toString(),
					newRouter.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(updatedRouter, HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	public ResponseEntity<Object> deleteRouter(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody ElRouter delRouter,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SISTEM_ADMIN, UsersRoles.SUPER_USER);
			} catch (Exception e) {

				auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.DELETE.toString(),
						delRouter.toString(),
						AuditFormats.Entity.ROUTER.toString(),
						delRouter.toString(),
						username,
						WebUtils.getRequestIP(request));

				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			ElRouter deleteRouter = elRouterService.deleteRouter(delRouter);

			auditServie.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
					AuditFormats.Event.DELETE.toString(),
					delRouter.toString(),
					AuditFormats.Entity.ROUTER.toString(),
					delRouter.toString(),
					username,
					WebUtils.getRequestIP(request));

			return new ResponseEntity<Object>(deleteRouter, HttpStatus.OK);	
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
