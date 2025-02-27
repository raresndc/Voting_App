package com.auth.model;

public class RequestUser {
	
	private String username;
	
	private String oldPassword;
	
	private String newPassword;
	
	private String phoneNumberString;
	
	private String role;
	
	private boolean notificationSms;
	
	public RequestUser() {}

	
	public RequestUser(String username, String oldPassword, String newPassword, String phoneNumberString,
			boolean notificationSms) {
		super();
		this.username = username;
		this.oldPassword = oldPassword;
		this.newPassword = newPassword;
		this.phoneNumberString = phoneNumberString;
		this.notificationSms = notificationSms;
	}



	public String getPhoneNumberString() {
		return phoneNumberString;
	}

	public void setPhoneNumberString(String phoneNumberString) {
		this.phoneNumberString = phoneNumberString;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public boolean isNotificationSms() {
		return notificationSms;
	}

	public void setNotificationSms(boolean notificationSms) {
		this.notificationSms = notificationSms;
	}
	
	
	

}
