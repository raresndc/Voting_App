package com.auth.config;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import com.auth.repository.ClientDetailsRepository;
import com.auth.service.CustomUserDetailsService;
import com.auth.service.PermissionService;
import com.auth.service.RoleDetailsService;
import com.google.gson.Gson;

import javax.annotation.PostConstruct;

import com.app.entity.ElDescription;
import com.app.repository.ElDescriptionRepository;
import com.app.repository.ElDeviceRepository;
import com.auth.config.UsersRoles;
import com.auth.entity.OauthClientDetails;
import com.auth.entity.Role;
import com.auth.entity.User;

@Configuration
public class DatabaseInit {


	@Value("${init.file}")
	private String initFile;

	//ASTA CITIT DIN FISIER SI SALVATA IN DB
//	public static final String USER_APP = "USER_CLIENT_APP";

	//ASTA CITIT DIN FISIER SI SALVATA IN DB
//	public static final String SECRET_APP = "123456";

	@Autowired
	PermissionService permissionService;

	@Autowired
	RoleDetailsService roleDetailsService;

	@Autowired
	CustomUserDetailsService userService;

	@Autowired
	ClientDetailsRepository clientDetailsRepository;
	
	@Autowired
	ElDescriptionRepository elDescriptionRepository;

	@PostConstruct
	public void init() {
		
		try {
			
			InitData credentialsFromFile = initDefaultCredentialsFromFile();

			if(roleDetailsService.getAllRoles().size() == 0) {
				Role adminUsers = new Role();
				Role guest = new Role();
				Role user = new Role();
				Role superUser = new Role();
				Role sistemAdmin = new Role();

				adminUsers.setPermissions(permissionService.getAllPermissions());
				adminUsers.setName(UsersRoles.ADMIN_USERS);

				guest.setPermissions(permissionService.getAllPermissions());
				guest.setName(UsersRoles.GUEST);

				user.setPermissions(permissionService.getAllPermissions());
				user.setName(UsersRoles.USER);

				superUser.setPermissions(permissionService.getAllPermissions());
				superUser.setName(UsersRoles.SUPER_USER);
				
				sistemAdmin.setPermissions(permissionService.getAllPermissions());
				sistemAdmin.setName(UsersRoles.SISTEM_ADMIN);

				roleDetailsService.createRole(adminUsers);
				roleDetailsService.createRole(guest);
				roleDetailsService.createRole(user);
				roleDetailsService.createRole(superUser);
				roleDetailsService.createRole(sistemAdmin);
			}

			if(userService.getAllUsersWithRoles().size() == 0) {

				User adminUser = new User();
				adminUser.setAccountNonExpired(false);
				adminUser.setEnabled(true);
				adminUser.setCredentialsNonExpired(false);
				adminUser.setAccountNonLocked(false);
				adminUser.setUsername("admin");
				
				adminUser.setPassword(credentialsFromFile.defaultPassword);
				
				Role admin = roleDetailsService.getRoleByName(UsersRoles.ADMIN_USERS);
				adminUser.setRoles(Arrays.asList(admin));    			
				userService.createUser(adminUser);
				
				User superUser = new User();
				superUser.setAccountNonExpired(false);
				superUser.setEnabled(true);
				superUser.setCredentialsNonExpired(false);
				superUser.setAccountNonLocked(false);
				superUser.setUsername("super_admin");
				
				superUser.setPassword(credentialsFromFile.defaultPasswordSuper);

				Role superAdmin = roleDetailsService.getRoleByName(UsersRoles.SUPER_USER);
				superUser.setRoles(Arrays.asList(superAdmin));    			
				userService.createUser(superUser);
				
			}

			if(clientDetailsRepository.findAll().size() == 0) {

				OauthClientDetails client = new OauthClientDetails();

				client.setClientId(credentialsFromFile.USER_APP);
				client.setClientSecret(credentialsFromFile.defaultPassword);
				
				client.setResouceIds("USER_CLIENT_RESOURCE,USER_ADMIN_RESOURCE");
				client.setScope("Administrator_Utilizatori");
				client.setAuthorizedGrantType("authorization_code,password,refresh_token,implicit");
				client.setWebServerRedirectUri(null);
				client.setAuthorities(null);
				client.setAccesTokenValidity(43200);
				client.setRefreshTokenValidity(43200);
				client.setAdditionalInformation("{}");
				client.setAutoapprove(null);

				clientDetailsRepository.saveAndFlush(client);
			}
			
			
			
			if(elDescriptionRepository.findAll().size() == 0) {
				ElDescription infoInsert = new ElDescription(credentialsFromFile.USER_APP, credentialsFromFile.SECRET_APP);
				
				elDescriptionRepository.save(infoInsert);
			}

			} catch (Exception e) {
				System.out.println("Error while init database!" + e.getLocalizedMessage() + e.getMessage());
			}
	
	}
	
	
	
	
	
	
	
	
	private InitData initDefaultCredentialsFromFile() throws Exception {

		InitData initData = new InitData();

		File initFile_ = new File(initFile);
		
		if(!initFile_.exists()) {
			System.out.println("Init file not found!");
		}
		
		String content = new String(Files.readAllBytes(Paths.get(initFile)));
		
		Gson gson = new Gson();

		initData = gson.fromJson(content, InitData.class);
		
		if(initData == null)
			throw new Exception("Nu s-au putut citi credentialele la initializarea bazei de date din fisierul: " + initFile);
		
		if(initData.defaultPassword == null)
			throw new Exception("In fisierul de initializare nu s-a regasit parametrul 'defaultPassword'");
		
		if(initData.defaultPassword.isEmpty() || initData.defaultPassword.length() <= 0)
			throw new Exception("In fisierul de initializare nu s-a regasit valoarea parametrului 'defaultPassword'");

		return initData;
	}

	private static class InitData {
		public String defaultPassword;
		public String defaultPasswordSuper;
		public String USER_APP;
		public String SECRET_APP;
		public List<IbdCredentials> credentials;
	}

	private static class IbdCredentials {
		public String username;
		public String password;
		public String ibdType;
		public String credentialType;
	}
	
	
	
	
	
	
	
}
