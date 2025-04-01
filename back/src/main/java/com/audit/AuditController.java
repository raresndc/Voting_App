package com.audit;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;

import com.ElectraApplication;
import com.auth.config.UsersRoles;
import com.auth.controller.RoleVerification;
import com.auth.model.ResponseUser;

@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000)
@RequestMapping("/audit")
@Controller
public class AuditController {
	
	@Value("${server.port}")
	private int port;
	
	@Autowired
	private AuditService auditService;
	
	@Autowired
	private RoleVerification rolveVerification;
	
	@RequestMapping(method = RequestMethod.GET, value = "/getAuditPageable")
	@ResponseBody
	public ResponseEntity<Object> getAudit(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token, 
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestParam(defaultValue = "0") final Integer pageIndex,
			@RequestParam(defaultValue = "10") final Integer pageSize,
			@RequestParam(required = false) @DateTimeFormat(pattern = "dd.MM.yyyy HH:mm:ss")  Date startDate,
			@RequestParam(required = false) @DateTimeFormat(pattern = "dd.MM.yyyy HH:mm:ss")  Date endDate,
			@RequestParam(required = false) final String entityName,
			HttpServletRequest request) {

//		dd-MM-yyyy
		
		try {
			
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.SISTEM_ADMIN, 
						UsersRoles.SUPER_USER,
						UsersRoles.ADMIN_USERS);
			
			} catch (Exception e) {
				auditService.createLogSucces(AuditFormats.Acces.UNNOUTORIZED.toString(),
						AuditFormats.Event.LIST.toString(),
						"Daterange: " + startDate + " - " + endDate,
						AuditFormats.Entity.AUDIT.toString(),
						null,
						username,
						WebUtils.getRequestIP(request));
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}
			
			RequestDateRange req = new RequestDateRange();
			req.start = startDate;
			req.stop = endDate;
			req.entityName = entityName;
			
			boolean startDateSetted = true;
			boolean endDateSetted = true;
			
			if(startDate == null) {
				startDate = new Date(-1);
				startDateSetted = false;
			}
			
			if(endDate == null) {
				endDate = new Date();
				endDateSetted = false;
			}
			
			req.stop = endDate;
			req.start = startDate;
			
			req = WebUtils.validateDaterange(req, startDateSetted, endDateSetted);
			
			Pageable pageable = PageRequest.of(pageIndex, pageSize);

			Page<Audit> audit = auditService.getAuditPaginated(req, pageable);
			
			return new ResponseEntity<Object>(audit, HttpStatus.OK);

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}



