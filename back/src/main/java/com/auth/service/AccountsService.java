package com.auth.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ElectraApplication;
import com.app.service.ElDeviceService;
import com.auth.entity.Role;
import com.auth.entity.User;
import com.auth.exception.CustomException;
import com.auth.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.security.SecureRandom;


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
	
    @Autowired
    private JavaMailSender mailSender;
	

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
	
	
	
	private static final String UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
    private static final String NUMBERS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!@#$%^&*()-_=+<>";

    private static final SecureRandom random = new SecureRandom();

    private char getRandomChar(String characters) {
        return characters.charAt(random.nextInt(characters.length()));
    }

    private String getRandomPasswordPart(String characters, int length) {
        StringBuilder part = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            part.append(getRandomChar(characters));
        }
        return part.toString();
    }

    public String generatePassword() {
        List<Character> passwordChars = new ArrayList<>();
        passwordChars.add(getRandomChar(UPPERCASE_LETTERS));
        passwordChars.add(getRandomChar(LOWERCASE_LETTERS));
        passwordChars.add(getRandomChar(NUMBERS));
        passwordChars.add(getRandomChar(SPECIAL_CHARACTERS));

        String remainingChars = getRandomPasswordPart(UPPERCASE_LETTERS + LOWERCASE_LETTERS + NUMBERS + SPECIAL_CHARACTERS, 8);
        for (char c : remainingChars.toCharArray()) {
            passwordChars.add(c);
        }

        Collections.shuffle(passwordChars);

        StringBuilder password = new StringBuilder(passwordChars.size());
        for (char c : passwordChars) {
            password.append(c);
        }

        return password.toString();
    }
	
	@Transactional
	public ResponseEntity<String> forgotPassword(String username) throws Exception {

		try {

			User user = (User) customUserDetails.loadUserByUsername(username);
			String newPassword = generatePassword();

			String newEncodedPass = passwordEncoder.encode(newPassword);

			user.setPassword(newEncodedPass);

			customUserDetails.updateUser(user);
			user.setPassChanged(false);
			
	        try {
	            String to = user.getEmail();
	            String subject = "Medical App - change password";
	            String body =  "Dear " + user.getName() + " " + user.getPrenume() + "\n" +"\n" + "We trust this message finds you well." + "\n" + "\n" + "We are pleased to inform you that your password for the Medical App has been successfully changed." + "\n" + "\n" + "New Account Details:" + "\n" + "- Username: " + user.getUsername() + "\n" + "- Password: " + newPassword + "\n" + "\n" + "For security reasons, we recommend changing your password immediately upon logging in again to your account." + "\n" + "\n" + "Thank you for choosing Medical App. We appreciate your trust in our services."  + "\n" + "\n" + "Best regards," + "\n" + "\n" + "The Medical App Team 🩸";

	            SimpleMailMessage message = new SimpleMailMessage();
	            message.setTo(to);
	            message.setSubject(subject);
	            message.setText(body);

	            mailSender.send(message);

	            return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
	        } catch (Exception e) {
	            ElectraApplication.logger.error(e.getMessage(), e);
	            return new ResponseEntity<>("Failed to send email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
	public void changeMail(String username,
			String email) throws Exception {

		try {

			 User dbUser = userRepository.findByEmail(email);
			
			if(dbUser != null) {
				throw new Exception("Un utilizator cu acest email exista deja!");
			}
			
			User user = (User) customUserDetails.loadUserByUsername(username);

			user.setEmail(email);

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
	public void changeFullAdress(String username, String tara, String judet, String localitate, String adresa) throws Exception {
		
		try {
			User user = (User) customUserDetails.loadUserByUsername(username);
			user.setTara(tara);
			user.setJudet(judet);
			user.setLocalitate(localitate);
			user.setAdresa(adresa);
			
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
			String password, Role role,
			String phoneNumber,  String name, String prenume, String gender, int age, LocalDate birthday, 
			String cetatenie, String cnp, String email, String adresa, String grupaSanguina, 
			String height, String judet, String localitate, String tara, String weight, boolean boliCronice
			) throws Exception {

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
			user.setName(name);
			user.setPrenume(prenume);
			user.setGender(gender);
			user.setAge(age);
			user.setBirthday(birthday);
			user.setCetatenie(cetatenie);
			user.setCnp(cnp);
			user.setEmail(email);
			user.setAdresa(adresa);
			user.setGrupaSanguina(grupaSanguina);
			user.setHeight(height);
			user.setJudet(judet);
			user.setLocalitate(localitate);
			user.setTara(tara);
			user.setWeight(weight);
			user.setBoliCronice(boliCronice);
			
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
	
	
	@Transactional
	public void changePasswordRandom(String username,
			String oldPassword,
			String newPassword) throws Exception {


		try {

			User user = (User) customUserDetails.loadUserByUsername(username);
			
			if(user.isPassChanged() == false) {

				String pass =  user.getPassword();
	
				if(passwordEncoder.matches(oldPassword,pass)) {
	
					String newEncodedPass = passwordEncoder.encode(newPassword);
	
					user.setPassword(newEncodedPass);
	
					customUserDetails.updateUser(user);
					user.setPassChanged(true);
				} else {
					throw new CustomException(CustomException.PASSWORD_DOESNT_MATCH,"Parola nu se potriveste!");
				}
			}
		} catch(Exception e) {
			throw e;
		}	
	}
	
	
}
