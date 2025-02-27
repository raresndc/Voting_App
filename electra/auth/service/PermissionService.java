package com.auth.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth.entity.Permission;
import com.auth.exception.CustomException;
import com.auth.repository.PermissionRepository;

@Service
public class PermissionService {

	@Autowired
	PermissionRepository permissionRepository;
	
	public Permission getPermissionByName (String name) {
		return permissionRepository.findPermissionByName(name);	
	}	
	
	public List<Permission> getAllPermissions() {
		return permissionRepository.findAll();
	}
	
	public void createPermission(Permission role) {
		this.permissionRepository.saveAndFlush(role);
	}
	
	public void createPermissions(String[] permissions) throws CustomException {
		
		for(String permission : permissions) {
			
			if(permissionRepository.findPermissionByName(permission) != null) {
				throw new CustomException(0, "Permission '" + permission +"' alredy exsist!");
			} else {
				Permission newPermission = new Permission(permission);
				permissionRepository.saveAndFlush(newPermission);
			}
		}
	}
}
