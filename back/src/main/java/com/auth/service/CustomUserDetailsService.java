package com.auth.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.auth.config.UsersRoles;
import com.auth.entity.User;
import com.auth.exception.CustomException;
import com.auth.repository.UserRepository;

@Service(value = "userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String input) {
		User user = userRepository.findByUsername(input);

		if (user == null)
			throw new BadCredentialsException("Credentiale gresite!");

		return user;
	}
	
	@Transactional
	public void createUser (User user) throws CustomException {
		
		User usr1 = userRepository.findByUsername(user.getUsername());
		
		if(usr1 == null) {

			userRepository.saveAndFlush(user);
			
		} else {
			throw new CustomException(CustomException.ACCOUNT_ALREADY_EXIST,"Contul deja exista!");	
		}
	}
	
	@Transactional
	public String[] getAllUsers () {
		
		List<User> userList = userRepository.findAll();
		
		List<String> stringList = new ArrayList<String>();
		
		for(User usr : userList) {
			if(usr.getRoles().stream().filter(roles -> roles.getName().equals(UsersRoles.SUPER_USER)).count() > 0 ) {
				continue;
			}
			
			String tmp = usr.getUsername();
			stringList.add(tmp);
		}
		
		return stringList.stream().toArray(String[]::new);
	}
	
	@Transactional
	public List<User> getAllUsersWithRoles () {
		
		List<User> userList = userRepository.findAll();
		
		return userList;
	}
	
	@Transactional
	public void updateUser(User user) throws CustomException {
		
		User usr1 = userRepository.findByUsername(user.getUsername());
		
		if(usr1 == null) {
			throw new CustomException(CustomException.BAD_CREDENTIALS, "Bad credentials!");
		}
		
		userRepository.save(user);

	}
	
	@Transactional
	public Page<User> getAllUsersWithRolesPaginated (Pageable page) {
		
		Page<User> userList = userRepository.findAll(page);
		
		return userList;
	}
	
	@Transactional
	public User getUserByUsername(String username) {
		
		User userList = userRepository.findByUsername(username);
		
		return userList;
	}
	
	@Transactional
	public void deleteUser(User user) {
		
		userRepository.delete(user);
		
	}
}
