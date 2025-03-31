package com.auth.model;

import java.time.LocalDate;

import javax.persistence.Column;

public class RequestUser {
	
	private String username;
	
	private String oldPassword;
	
	private String newPassword;
	
	private String phoneNumberString;
	
	private String role;
	
	

	private String name;

	private String prenume;
	
	private String gender;
	
	private String grupaSanguina;
	
	private boolean boliCronice;
	
	private String email;

	private String height;
	
	private String weight;

	private String cnp;
	
	private String cetatenie;
	
	private String tara;
	
	private String judet;
	
	private String localitate;
	
	private String adresa;
	
	private LocalDate birthday;
	
	private Integer age;
	
	
	
	
	
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


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getPrenume() {
		return prenume;
	}


	public void setPrenume(String prenume) {
		this.prenume = prenume;
	}


	public String getGender() {
		return gender;
	}


	public void setGender(String gender) {
		this.gender = gender;
	}


	public String getGrupaSanguina() {
		return grupaSanguina;
	}


	public void setGrupaSanguina(String grupaSanguina) {
		this.grupaSanguina = grupaSanguina;
	}


	public boolean getBoliCronice() {
		return boliCronice;
	}


	public void setBoliCronice(boolean boliCronice) {
		this.boliCronice = boliCronice;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getHeight() {
		return height;
	}


	public void setHeight(String height) {
		this.height = height;
	}


	public String getWeight() {
		return weight;
	}


	public void setWeight(String weight) {
		this.weight = weight;
	}


	public String getCnp() {
		return cnp;
	}


	public void setCnp(String cnp) {
		this.cnp = cnp;
	}


	public String getCetatenie() {
		return cetatenie;
	}


	public void setCetatenie(String cetatenie) {
		this.cetatenie = cetatenie;
	}


	public String getTara() {
		return tara;
	}


	public void setTara(String tara) {
		this.tara = tara;
	}


	public String getJudet() {
		return judet;
	}


	public void setJudet(String judet) {
		this.judet = judet;
	}


	public String getLocalitate() {
		return localitate;
	}


	public void setLocalitate(String localitate) {
		this.localitate = localitate;
	}


	public String getAdresa() {
		return adresa;
	}


	public void setAdresa(String adresa) {
		this.adresa = adresa;
	}


	public LocalDate getBirthday() {
		return birthday;
	}


	public void setBirthday(LocalDate birthday) {
		this.birthday = birthday;
	}


	public Integer getAge() {
		return age;
	}


	public void setAge(Integer age) {
		this.age = age;
	}
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
