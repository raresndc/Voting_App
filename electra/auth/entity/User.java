package com.auth.entity;

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
	
	
	

}
