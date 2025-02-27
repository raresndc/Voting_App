package com.auth.model;

import java.util.Arrays;

public class RequestCreateRole {
	
	private String role;
	
	private String[] permissions;

	public RequestCreateRole(String role, String[] permissions) {
		super();
		this.role = role;
		this.permissions = permissions;
	}
	
	public RequestCreateRole() {
		super();
	}


	public String[] getPermissions() {
		return permissions;
	}

	public void setPermissions(String[] permissions) {
		this.permissions = permissions;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "RequestCreateRole [role=" + role + ", permissions=" + Arrays.toString(permissions) + "]";
	}
}
