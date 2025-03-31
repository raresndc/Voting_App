package com.auth.model;

import java.util.Arrays;

public class RequestCreatePermission {
	
	private String[] permissions;

	public RequestCreatePermission(String[] permissions) {
		super();
		this.permissions = permissions;
	}
	
	public RequestCreatePermission() {
		super();
	}

	public String[] getPermissions() {
		return permissions;
	}

	public void setPermissions(String[] permissions) {
		this.permissions = permissions;
	}

	@Override
	public String toString() {
		return "RequestCreatePermission [permissions=" + Arrays.toString(permissions) + "]";
	}
}
