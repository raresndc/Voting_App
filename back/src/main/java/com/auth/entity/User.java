package com.auth.entity;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.app.entity.ElDevice;
import com.app.entity.ElSmsSend;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.JoinColumn;

@Entity
public class User extends BaseIdEntity implements UserDetails {

	private static final long serialVersionUID = 1L;
	
	private String username;
	
	private Date lastTimeLogged;
	
	private int failedLoginCount = 0;
	
	private String phoneNumberString;
	
	@Column(name = "name", columnDefinition = "VARCHAR(50)")
	private String name;
	
	@Column(name = "prenume", columnDefinition = "VARCHAR(50)")
	private String prenume;
	
	@Column(name = "gender", columnDefinition = "VARCHAR(10)")
	private String gender;
	
	@Column(name = "grupa_sanguina", columnDefinition = "VARCHAR(4)")
	private String grupaSanguina;
	
	@Column(name = "boli_cronice", columnDefinition = "VARCHAR(100)")
	private boolean boliCronice;
	
	@Column(name = "email", columnDefinition = "VARCHAR(50)")
	private String email;
	
	@Column(name = "pacient_phone", columnDefinition = "VARCHAR(10)")
	private String pacientPhoneNumber;
	
	@Column(name = "height", columnDefinition = "VARCHAR(13)")
	private String height;
	
	@Column(name = "weight", columnDefinition = "VARCHAR(13)")
	private String weight;

	@Column(name = "CNP", columnDefinition = "VARCHAR(13)")
	private String cnp;
	
	@Column(name = "cetatenie", columnDefinition = "VARCHAR(100)")
	private String cetatenie;
	
	@Column(name = "tara", columnDefinition = "VARCHAR(50)")
	private String tara;
	
	@Column(name = "judet", columnDefinition = "VARCHAR(30)")
	private String judet;
	
	@Column(name = "localitate", columnDefinition = "VARCHAR(50)")
	private String localitate;
	
	@Column(name = "adresa", columnDefinition = "VARCHAR(500)")
	private String adresa;
	
	@Column(name = "birthday", columnDefinition = "VARCHAR(30)")
	private LocalDate birthday;
	
	@Column(name = "age", columnDefinition = "VARCHAR(5)")
	private Integer age;
	
	private boolean passChanged;
	
	
	
	
	
	
	
	
	
	
	

	private boolean notificationSms;
	
	public boolean isNotificationSms() {
		return notificationSms;
	}

	public void setNotificationSms(boolean notificationSms) {
		this.notificationSms = notificationSms;
	}

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@ManyToMany(mappedBy = "users", cascade = CascadeType.ALL)
	List<ElDevice> devices;
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToMany(mappedBy = "senderUser", cascade = CascadeType.ALL, orphanRemoval = true) 
	private List<ElSmsSend> elSmsSend;
	
	public List<ElSmsSend> getElSmsSend() {
		return elSmsSend;
	}

	public void setElSmsSend(List<ElSmsSend> elSmsSend) {
		this.elSmsSend = elSmsSend;
	}

	public List<ElDevice> getDevices() {
		return devices;
	}

	public void setDevices(List<ElDevice> devices) {
		this.devices = devices;
	}
	
	public void addDevice(ElDevice device) {
		this.devices.add(device);
	}

	public Date getLastTimeLogged() {
		return lastTimeLogged;
	}

	public void setLastTimeLogged(Date lastTimeLogged) {
		this.lastTimeLogged = lastTimeLogged;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;
	
	public void setPassword(String password) {
		this.password = password;
	}

	private boolean enabled;
	
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
	public int getFailedLoginCount() {
		return failedLoginCount;
	}

	public void setFailedLoginCount(int failedLoginCount) {
		this.failedLoginCount = failedLoginCount;
	}

	public String getPhoneNumberString() {
		return phoneNumberString;
	}

	public void setPhoneNumberString(String phoneNumberString) {
		this.phoneNumberString = phoneNumberString;
	}

	@Column(name = "account_locked")
	private boolean accountNonLocked;
	
	public void setAccountNonLocked(boolean accountNonLocked) {
		this.accountNonLocked = accountNonLocked;
	}

	@Column(name = "account_expired")
	private boolean accountNonExpired;

	public void setAccountNonExpired(boolean accountNonExpired) {
		this.accountNonExpired = accountNonExpired;
	}

	@Column(name = "credentials_expired")
	private boolean credentialsNonExpired;

	public void setCredentialsNonExpired(boolean credentialsNonExpired) {
		this.credentialsNonExpired = credentialsNonExpired;
	}

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "role_user", joinColumns = {
			@JoinColumn(name = "user_id", referencedColumnName = "id") }, inverseJoinColumns = {
					@JoinColumn(name = "role_id", referencedColumnName = "id") })
	private List<Role> roles;

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	@Override
	public boolean isEnabled() {
		return enabled;
	}

	@Override
	public boolean isAccountNonExpired() {
		return !accountNonExpired;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return !credentialsNonExpired;
	}

	@Override
	public boolean isAccountNonLocked() {
		return !accountNonLocked;
	}

	/*
	 * Get roles and permissions and add them as a Set of GrantedAuthority
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();

		roles.forEach(r -> {
			authorities.add(new SimpleGrantedAuthority(r.getName()));
			r.getPermissions().forEach(p -> {
				authorities.add(new SimpleGrantedAuthority(p.getName()));
			});
		});

		return authorities;
	}
	

	public void setAuthorities(Set<GrantedAuthority> authorities) {
		
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
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

	public boolean isBoliCronice() {
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

	public String getPacientPhoneNumber() {
		return pacientPhoneNumber;
	}

	public void setPacientPhoneNumber(String pacientPhoneNumber) {
		this.pacientPhoneNumber = pacientPhoneNumber;
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
	
	
	public boolean isPassChanged() {
		return passChanged;
	}

	public void setPassChanged(boolean passChanged) {
		this.passChanged = passChanged;
	}

}
