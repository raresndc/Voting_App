package com.auth.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth.config.UsersRoles;
import com.auth.entity.Role;
import com.auth.repository.RoleRepository;

@Service
public class RoleDetailsService {

	@Autowired
	RoleRepository roleRepository;

	public Role getRoleByName (String name) {
		return roleRepository.findRoleByName(name);
	}	

	public List<Role> getAllRoles() {
		return roleRepository.findAll().stream()
				.filter(role -> !role.getName().equals(UsersRoles.SUPER_USER))
				.collect(Collectors.toList());

	}

	public void createRole(Role role) {
		this.roleRepository.saveAndFlush(role);
	}

}
