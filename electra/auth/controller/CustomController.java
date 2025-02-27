package com.auth.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.ElectraApplication;
import com.app.entity.ElDescription;
import com.auth.config.DatabaseInit;
import com.auth.config.UsersRoles;
import com.auth.entity.Permission;
import com.auth.entity.Role;
import com.auth.entity.User;
import com.auth.exception.CustomException;
import com.auth.model.AccesToken;
import com.auth.model.RequestCreatePermission;
import com.auth.model.RequestCreateRole;
import com.auth.model.RequestLogin;
import com.auth.model.RequestUser;
import com.auth.model.ResponseUser;
import com.auth.model.TokenRequest;
import com.auth.service.AccountsService;
import com.auth.service.CustomUserDetailsService;
import com.auth.service.PermissionService;
import com.auth.service.RoleDetailsService;
import com.auth.util.Utils;
import com.google.gson.Gson;

import javax.annotation.Resource;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
@Controller
public class CustomController {

	@Resource(name="tokenServices")
	DefaultTokenServices tokenServices;

	@Value("${server.port}")
	private int port;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AccountsService accountsService;

	@Autowired
	private RoleDetailsService rolesService;

	@Autowired
	private PermissionService permissionService;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Autowired
	private RoleVerification rolveVerification;


	@RequestMapping(method = RequestMethod.POST, value = "/tokens/revoke")
	@ResponseBody
	public ResponseEntity<ResponseUser> revokeToken(@RequestBody TokenRequest req) {

		try {

			if(req.getToken() == null || req.getToken().equals("")) {
				return new ResponseEntity<ResponseUser>(new ResponseUser("0","No token given."),HttpStatus.OK);
			}

			boolean ok = tokenServices.revokeToken(req.getToken());

			if(ok == true)
				return new ResponseEntity<ResponseUser>(new ResponseUser("1","Ok"),HttpStatus.OK);
			else
				return new ResponseEntity<ResponseUser>(new ResponseUser("0","Ok"),HttpStatus.OK);

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<ResponseUser>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/genPwd")
	@ResponseBody
	public String generateCryPwd(@RequestBody String pwd) {
		return passwordEncoder.encode(pwd);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/changePassword")
	@ResponseBody
	public ResponseEntity<ResponseUser> changePassword(@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {

			CredentialsVerification.checkPasswordConstrains(req.getNewPassword());

			accountsService.changePassword(req.getUsername(),
					req.getOldPassword(),
					req.getNewPassword());

			System.gc();


			return new ResponseEntity<ResponseUser>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<ResponseUser>(new ResponseUser("0",e.getMessage()),HttpStatus.OK);
		} catch (BadCredentialsException e) {
			return new ResponseEntity<ResponseUser>(new ResponseUser("0","Bad Credentials"),HttpStatus.OK);
		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<ResponseUser>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/changePasswordByAdmin")
	@ResponseBody
	public ResponseEntity<Object> changePasswordByAdmin(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {	
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			CredentialsVerification.checkPasswordConstrains(req.getNewPassword());

			accountsService.changePasswordByAdmin(req.getUsername(),
					req.getNewPassword());


			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.OK);
		} catch (BadCredentialsException e) {
			return new ResponseEntity<Object>(new ResponseUser("0","Bad Credentials"),HttpStatus.OK);
		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/getAllUsers")
	@ResponseBody
	public ResponseEntity<Object> getAllUsers(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token) {

		try {

			rolveVerification.checkUserRole(access_token, refresh_token, port, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);

			return new ResponseEntity<Object>(accountsService.getAllUsers(),HttpStatus.OK);

		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/changePhoneNumberByAdmin")
	@ResponseBody
	public ResponseEntity<Object> changePhoneNumberByAdmin(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						 UsersRoles.SUPER_USER, UsersRoles.ADMIN_USERS);
				
			} catch (Exception e) {	
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			accountsService.changePhoneNumberByAdmin(req.getUsername(),
					req.getPhoneNumberString());

			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.OK);
		} catch (BadCredentialsException e) {
			return new ResponseEntity<Object>(new ResponseUser("0","Bad Credentials"),HttpStatus.OK);
		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/changePhoneNumberByUser")
	@ResponseBody
	public ResponseEntity<Object> changePhoneNumberByUser(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						 UsersRoles.SUPER_USER, UsersRoles.ADMIN_USERS, UsersRoles.USER, UsersRoles.GUEST, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {	
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			accountsService.changePhoneNumberByAdmin(username,
					req.getPhoneNumberString());

			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.OK);
		} catch (BadCredentialsException e) {
			return new ResponseEntity<Object>(new ResponseUser("0","Bad Credentials"),HttpStatus.OK);
		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@RequestMapping(method = RequestMethod.POST, value = "/notificationStatus")
	@ResponseBody
	public ResponseEntity<Object> changeNotificationStatus(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request){
		
		try {

			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.USER, UsersRoles.ADMIN_USERS, UsersRoles.GUEST, UsersRoles.SUPER_USER, UsersRoles.SISTEM_ADMIN);
			} catch (Exception e) {	
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			accountsService.changeNotificationStatus(req.getUsername(),
					req.isNotificationSms());


			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.OK);
		} catch (BadCredentialsException e) {
			return new ResponseEntity<Object>(new ResponseUser("0","Bad Credentials"),HttpStatus.OK);
		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/getAllUsersWithRolesPaginated")
	@ResponseBody
	public ResponseEntity<Object> getAllUsersWithRolesPaginated(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@RequestParam(defaultValue = "10") int pageSize,
			@RequestParam(defaultValue = "0") int pageIndex,
			HttpServletRequest request) {

		try {

			rolveVerification.checkUserRole(access_token, refresh_token, port, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);

			Page<User> userList = customUserDetailsService.getAllUsersWithRolesPaginated(PageRequest.of(pageIndex, pageSize));

			for(User user: userList) {
				user.setPassword(null);
			}

			return new ResponseEntity<Object>(userList,HttpStatus.OK);

		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getCurrentUser")
	@ResponseBody
	public ResponseEntity<Object> getCurrentUser(
			@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			HttpServletRequest request) {

		try {

			rolveVerification.checkUserRole(access_token, refresh_token, port, UsersRoles.ADMIN_USERS,
					UsersRoles.SUPER_USER,
					UsersRoles.GUEST,
					UsersRoles.SISTEM_ADMIN,
					UsersRoles.USER);

			User user = customUserDetailsService.getUserByUsername(username);

			return new ResponseEntity<Object>(user, HttpStatus.OK);

		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getAllUsersWithRoles")
	@ResponseBody
	public ResponseEntity<Object> getAllUsersWithRoles(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			HttpServletRequest request) {

		try {

			rolveVerification.checkUserRole(access_token, refresh_token, port, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);

			List<User> userList = customUserDetailsService.getAllUsersWithRoles();

			for(User user: userList) {
				user.setPassword(null);
			}

			return new ResponseEntity<Object>(userList,HttpStatus.OK);

		} catch(Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/deleteUser")
	@ResponseBody
	public ResponseEntity<Object> deleteUser(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}
			accountsService.deleteUser(req.getUsername());

			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/unlockUser")
	@ResponseBody
	public ResponseEntity<Object> unlockUser(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}
			accountsService.unlockUser(req.getUsername());
			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getAllRoles")
	@ResponseBody
	public ResponseEntity<Object> getAllRoles(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token) {	
		try {
			rolveVerification.checkUserRole(access_token, refresh_token, port, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			return new ResponseEntity<Object>(rolesService.getAllRoles(),HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/createRole")
	@ResponseBody
	public ResponseEntity<Object> createRole(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestCreateRole createRoleReq,
			HttpServletRequest request) {	

		try {
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {	
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			Role existingRole = rolesService.getRoleByName(createRoleReq.getRole());
			if(existingRole != null) {
				return new ResponseEntity<Object>(new ResponseUser("0","Role '" + createRoleReq.getRole() + "' already exist!"),HttpStatus.OK);	
			}

			Role newRole = new Role();
			newRole.setName(createRoleReq.getRole());

			List<Permission> permissions = new ArrayList<Permission>();

			for(String permission : createRoleReq.getPermissions()) {

				Permission newPermission = permissionService.getPermissionByName(permission);

				if(newPermission == null) {
					return new ResponseEntity<Object>(new ResponseUser("0","Permission '" + permission + "' doesn't exist! You should create it first!"),HttpStatus.OK);	
				}

				permissions.add(newPermission);
			}

			if(permissions.size() > 0) {
				newRole.setPermissions(permissions);
			}

			this.rolesService.createRole(newRole);

			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);	

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/createUserByRole")
	@ResponseBody
	public ResponseEntity<Object> createUserByRole(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestUser req,
			HttpServletRequest request) {

		try {
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}

			CredentialsVerification.checkPasswordConstrains(req.getNewPassword());
			CredentialsVerification.checkUsernameContrains(req.getUsername());

			Role role = rolesService.getRoleByName(req.getRole());

			accountsService.createUserByRole(req.getUsername(),
					req.getNewPassword(),
					role,
					req.getPhoneNumberString());
			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);
			
			//TODO de adaugat audit aici
			

		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getAllPermissions")
	@ResponseBody
	public ResponseEntity<Object> getAllPermissions(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			HttpServletRequest request) {		
		try {
			rolveVerification.checkUserRole(access_token, refresh_token, port, UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			return new ResponseEntity<Object>(permissionService.getAllPermissions(),HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/createPermissions")
	@ResponseBody
	public ResponseEntity<Object> createPermissions(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestCreatePermission req,
			HttpServletRequest request) {	
		try {
			try {
				rolveVerification.checkUserRole(access_token, refresh_token, port, 
						UsersRoles.ADMIN_USERS, UsersRoles.SUPER_USER);
			} catch (Exception e) {
				return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.UNAUTHORIZED);
			}
			permissionService.createPermissions(req.getPermissions());
			return new ResponseEntity<Object>(new ResponseUser("1","Ok"),HttpStatus.OK);
		} catch (CustomException e) {
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.OK);
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/login")
	@ResponseBody
	public ResponseEntity<Object> login(@CookieValue(name = "username", defaultValue = "") String username,
			@RequestBody RequestLogin req,
			HttpServletResponse responseServlet,
			HttpServletRequest request1) {

		try {

			OkHttpClient client = UnsafeOkHttp.getUnsafeOkHttpClient();


			MultipartBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
					.addFormDataPart("grant_type", "password")
					.addFormDataPart("username", req.getUsername())
					.addFormDataPart("password",req.getPassword())
					.build();
			String info1 = rolveVerification.information1();
			String info2 = rolveVerification.information2();

			Request request = new Request.Builder()
					.url("https://localhost:" + port + "/oauth/token")
					.method("POST", body)
					.addHeader("Content-Type", "application/json")
					//					.addHeader("Authorization", Utils.getBasicAuth(DatabaseInit.USER_APP, DatabaseInit.SECRET_APP))
					.addHeader("Authorization", Utils.getBasicAuth(info1, info2))
					.addHeader("Cookie", "JSESSIONID=DA82AD843CF7351F826BAC529EB59ED1")
					.build();

			Response response = client.newCall(request).execute();

			if(response.code() != 200) {
				if(accountsService.failedLogin(req.getUsername())) {
					return new ResponseEntity<Object>(new ResponseUser("0","Cont blocat!"),HttpStatus.LOCKED);				
				} 
				return new ResponseEntity<Object>(response.body().string() ,HttpStatus.valueOf(response.code()));
			}

			accountsService.resetLoginFailedCount(req.getUsername());

			Gson gson = new Gson();

			AccesToken accesToken = gson.fromJson(response.body().string(), AccesToken.class);

			accesToken = rolveVerification.checkToken(accesToken.access_token, accesToken.refresh_token, port);

			if(accesToken.responseCode != 200) {

				return new ResponseEntity<Object>(accesToken.errorMessage, HttpStatus.valueOf(accesToken.responseCode));
			}

			Cookie accesTokenCookie = new Cookie("access_token", accesToken.access_token);
			accesTokenCookie.setMaxAge(7 * 24 * 60 * 60);
			accesTokenCookie.setSecure(true);
			accesTokenCookie.setHttpOnly(true);

			Cookie refreshTokenCookie = new Cookie("refresh_token", accesToken.refresh_token);
			refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
			refreshTokenCookie.setSecure(true);
			refreshTokenCookie.setHttpOnly(true);

			Cookie roleCookie = new Cookie("role", accesToken.accesTokenDetails.authorities.get(0));
			roleCookie.setMaxAge(7 * 24 * 60 * 60);
			roleCookie.setHttpOnly(false);
			roleCookie.setSecure(true);

			Cookie usernameCookie = new Cookie("username", req.getUsername());			
			usernameCookie.setMaxAge(7 * 24 * 60 * 60);
			usernameCookie.setSecure(true);
			usernameCookie.setHttpOnly(false);		

			responseServlet.addCookie(accesTokenCookie);
			responseServlet.addCookie(refreshTokenCookie);
			responseServlet.addCookie(roleCookie);
			responseServlet.addCookie(usernameCookie);

			accountsService.setDatetimeNowForLogin(req.getUsername());

			return new ResponseEntity<Object>(null,HttpStatus.OK);


		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/autorizeUsers")
	@ResponseBody
	public ResponseEntity<Object> autorizeUsers(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			HttpServletResponse responseServlet,
			HttpServletRequest request) {

		try {

			if(access_token == null || refresh_token == null || access_token.equals("") || refresh_token.equals("")) {
				return new ResponseEntity<Object>(null,HttpStatus.FORBIDDEN);
			}

			AccesToken accessToken = rolveVerification.checkToken(access_token, refresh_token, port);

			if(accessToken.responseCode == 200 && accessToken.accesTokenDetails.active) {

				Cookie accesTokenCookie = new Cookie("access_token", accessToken.access_token);
				accesTokenCookie.setMaxAge(7 * 24 * 60 * 60);
				accesTokenCookie.setSecure(true);
				accesTokenCookie.setHttpOnly(true);

				responseServlet.addCookie(accesTokenCookie);

				return new ResponseEntity<Object>(null,HttpStatus.OK);
			} else {
				return new ResponseEntity<Object>(null,HttpStatus.FORBIDDEN);
			}

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<Object>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/logoutUser")
	@ResponseBody
	public ResponseEntity<ResponseUser> logoutUser(@CookieValue(name = "access_token", defaultValue = "") String access_token,
			@CookieValue(name = "username", defaultValue = "") String username,
			@CookieValue(name = "refresh_token", defaultValue = "") String refresh_token,
			HttpServletResponse responseServlet,
			HttpServletRequest request) {

		try {

			Cookie accesTokenCookie = new Cookie("access_token", "");
			accesTokenCookie.setMaxAge(0);
			accesTokenCookie.setSecure(true);
			accesTokenCookie.setHttpOnly(true);

			Cookie refreshTokenCookie = new Cookie("refresh_token", "");
			refreshTokenCookie.setMaxAge(0);
			refreshTokenCookie.setSecure(true);
			refreshTokenCookie.setHttpOnly(true);

			Cookie roleCookie = new Cookie("role", "");
			roleCookie.setMaxAge(0);
			roleCookie.setSecure(true);
			roleCookie.setHttpOnly(false);

			Cookie usernameCookie = new Cookie("username", "");			
			usernameCookie.setMaxAge(0);
			usernameCookie.setSecure(true);
			usernameCookie.setHttpOnly(false);		

			Cookie sicCookie = new Cookie("sic", "");			
			sicCookie.setMaxAge(0);
			sicCookie.setSecure(true);
			sicCookie.setHttpOnly(false);	

			responseServlet.addCookie(accesTokenCookie);
			responseServlet.addCookie(refreshTokenCookie);
			responseServlet.addCookie(roleCookie);
			responseServlet.addCookie(usernameCookie);
			responseServlet.addCookie(sicCookie);

			if(access_token == null || access_token.equals("")) {	
				return new ResponseEntity<ResponseUser>(new ResponseUser("0","No token given."),HttpStatus.OK);
			}

			boolean ok1 = tokenServices.revokeToken(refresh_token);

			boolean ok = tokenServices.revokeToken(access_token);

			if(ok == true && ok1 == true) {
				return new ResponseEntity<ResponseUser>(new ResponseUser("1","Ok"),HttpStatus.OK);
			}
			else {
				return new ResponseEntity<ResponseUser>(new ResponseUser("0","Ok"),HttpStatus.OK);
			}

		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(), e);
			return new ResponseEntity<ResponseUser>(new ResponseUser("0",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}



