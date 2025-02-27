package com.auth.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.service.ElDeviceService;
import com.auth.entity.Role;
import com.auth.entity.User;
import com.auth.exception.CustomException;
import com.auth.repository.UserRepository;

@Service
public class AccountsService {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private CustomUserDetailsService customUserDetails;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ElDeviceService elDeviceService;

	@Value("${login.failed.maxcount}")
	private int maxFailedLoginCount;

	@Transactional
	public void changePassword(String username,
			String oldPassword,
			String newPassword) throws Exception {


		try {

			User user = (User) customUserDetails.loadUserByUsername(username);

			String pass =  user.getPassword();

			if(passwordEncoder.matches(oldPassword,pass)) {

				String newEncodedPass = passwordEncoder.encode(newPassword);

				user.setPassword(newEncodedPass);

				customUserDetails.updateUser(user);

			} else {
				throw new CustomException(CustomException.PASSWORD_DOESNT_MATCH,"Parola nu se potriveste!");
			}
		} catch(Exception e) {
			throw e;
		}	
	}

	@Transactional
	public void changePasswordByAdmin(String username,
			String newPassword) throws Exception {

		try {

			User user = (User) customUserDetails.loadUserByUsername(username);

			String newEncodedPass = passwordEncoder.encode(newPassword);

			user.setPassword(newEncodedPass);

			customUserDetails.updateUser(user);

		} catch(Exception e) {
			throw e;
		}	
	}

	@Transactional
	public void lockUser(String username) throws Exception {

		User user = (User) customUserDetails.loadUserByUsername(username);

		if(user == null) {
			throw new Exception("Username: " + username + " does not exist!");
		}

		user.setAccountNonLocked(true);

		customUserDetails.updateUser(user);
	}

	@Transactional
	public void setDatetimeNowForLogin(String username) throws Exception {

		User user = (User) customUserDetails.loadUserByUsername(username);

		if(user == null) {
			throw new Exception("Username: " + username + " does not exist!");
		}

		user.setLastTimeLogged(new Date());

		customUserDetails.updateUser(user);
	}
	
	@Transactional
	public void changePhoneNumberByAdmin(String username,
			String phoneNumber) throws Exception {

		try {

			 User dbUser = userRepository.findByPhoneNumberString(phoneNumber);
			
			if(dbUser != null) {
				throw new Exception("Un utilizator cu acest numar de telefon exista deja!");
			}
			
			User user = (User) customUserDetails.loadUserByUsername(username);

			user.setPhoneNumberString(phoneNumber);

			customUserDetails.updateUser(user);

		} catch(Exception e) {
			throw e;
		}	
	}
	
	@Transactional
	public void changeNotificationStatus(String username, boolean notificationSms) throws Exception {
		
		try {
			User user = (User) customUserDetails.loadUserByUsername(username);
			user.setNotificationSms(notificationSms);
			
			customUserDetails.updateUser(user);
			
		} catch (Exception e) {
			throw e;
		}
		
	}
	
	@Transactional
	public void unlockUser(String username) throws Exception {

		User user = (User) customUserDetails.loadUserByUsername(username);

		if(user == null) {
			throw new Exception("Username: " + username + " does not exist!");
		}

		user.setFailedLoginCount(0);
		user.setAccountNonLocked(false);

		customUserDetails.updateUser(user);
	}

	@Transactional
	public void resetLoginFailedCount(String username) throws Exception {

		User user = (User) customUserDetails.loadUserByUsername(username);

		if(user == null) {
			throw new Exception("Username: " + username + " does not exist!");
		}

		user.setFailedLoginCount(0);

		customUserDetails.updateUser(user);
	}
	
	@Transactional
	public boolean failedLogin(String username) throws Exception {

		try {

			User user = (User) customUserDetails.loadUserByUsername(username);

			if(user == null) {
				throw new Exception("Username: " + username + " does not exist!");
			}

			if(user.getFailedLoginCount() >= maxFailedLoginCount) {
				this.lockUser(user.getUsername());	
				return true;
			} else {
				user.setFailedLoginCount(1 + user.getFailedLoginCount());
				customUserDetails.updateUser(user);
				return false;
			}		
		} catch (Exception e) {
			return false;
		}
	}
	
	@Transactional
	public void createUserByRole(String username,
			String password,
			Role role,
			String phoneNumber) throws Exception {

		try {

			List<User> dbUser = userRepository.findByPhoneNumberStringOrUsername(phoneNumber, username);
			
			if(dbUser.size() != 0) {
				throw new Exception("Utilizator cu acest nume sau numar de telefon exista deja!");
			}
			
			User user = new User();

			String newEncodedPass = passwordEncoder.encode(password);

			user.setUsername(username);

			user.setPassword(newEncodedPass);

			user.setEnabled(true);
			user.setAccountNonExpired(false);
			user.setCredentialsNonExpired(false);
			user.setAccountNonLocked(false);
			user.setPhoneNumberString(phoneNumber);

			List<Role> roles = new ArrayList<>(); 
			roles.add(role);

			user.setRoles(roles);	 

			customUserDetails.createUser(user);
		} catch (Exception e) {
			throw e;
		}

	}

	public String[] getAllUsers() {
		return customUserDetails.getAllUsers();
		
	}

	@Transactional
	public void deleteUser(String username) throws CustomException {

		try {

			User user = (User) customUserDetails.loadUserByUsername(username);

			if(user == null) {
				throw new CustomException(CustomException.USER_DOESNT_EXIST, "Utilizatorul nu exista!");
			}

			elDeviceService.deleteAllDevicesForUser(user);
			
			customUserDetails.deleteUser(user);

		} catch (Exception e) {
			throw e;
		}	
	}
}
