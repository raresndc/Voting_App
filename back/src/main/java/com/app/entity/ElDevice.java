package com.app.entity;

import java.io.Serializable;
import java.util.List;
import com.auth.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

@Entity
@Table(name = "el_device")
public class ElDevice implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "device_msisdn", columnDefinition = "VARCHAR(13)")
	private String deviceMsisdn;

	@Column(name = "device_phone", columnDefinition = "VARCHAR(13)")
	private String devicePhone;

	@Column(name = "device_details", columnDefinition = "VARCHAR(100)")
	private String deviceDetails;

	@Column(name = "device_location", columnDefinition = "VARCHAR(50)")
	private String deviceLocation;

	@Column(name = "device_name", columnDefinition = "VARCHAR(25)")
	private String deviceName;
	
	@Column(name = "status", columnDefinition = "VARCHAR(20)")
    private String status;

	private boolean masterActivated;

	private boolean userActivated;

	@ManyToOne(fetch = FetchType.LAZY)
	private ElRouter elRouter;

	@ManyToOne(fetch = FetchType.LAZY)
	private ElDeviceType elDeviceType;

	@ManyToOne(fetch = FetchType.LAZY)
	private ElRouter masterRouter;

	@ManyToMany
	@JoinTable(name = "device_users", joinColumns = @JoinColumn(name = "el_device_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	List<User> users;

	@OneToMany(mappedBy = "elDevice", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private List<ElSmsReceived> elSmsMessage;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToMany(mappedBy = "receiverDevice", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ElSmsSend> elSmsSend;

	public List<ElSmsReceived> getElSmsMessage() {
		return elSmsMessage;
	}

	public void setElSmsMessage(List<ElSmsReceived> elSmsMessage) {
		this.elSmsMessage = elSmsMessage;
	}

	public List<ElSmsSend> getElSmsSend() {
		return elSmsSend;
	}

	public void setElSmsSend(List<ElSmsSend> elSmsSend) {
		this.elSmsSend = elSmsSend;
	}
	
	

	public ElDevice() {
//		this.status = "ACTIVE";
	}
	
	
	
	

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public void addUser(User user) {
		this.users.add(user);
	}

	public ElRouter getMasterRouter() {
		return masterRouter;
	}

	public void setMasterRouter(ElRouter masterRouter) {
		this.masterRouter = masterRouter;
	}

	public ElRouter getElRouter() {
		return elRouter;
	}

	public void setElRouter(ElRouter elRouter) {
		this.elRouter = elRouter;
	}

	public ElDeviceType getElDeviceType() {
		return elDeviceType;
	}

	public void setElDeviceType(ElDeviceType elDeviceType) {
		this.elDeviceType = elDeviceType;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDeviceMsisdn() {
		return deviceMsisdn;
	}

	public void setDeviceMsisdn(String deviceMsisdn) {

		
		
		if (deviceMsisdn != null) {
			if (!deviceMsisdn.startsWith("004")) {
				deviceMsisdn = "004" + deviceMsisdn;
			}

			
		}
		this.deviceMsisdn = deviceMsisdn;
	}

	public String getDeviceDetails() {
		return deviceDetails;
	}

	public void setDeviceDetails(String deviceDetails) {
		this.deviceDetails = deviceDetails;
	}

	public String getDeviceLocation() {
		return deviceLocation;
	}

	public void setDeviceLocation(String deviceLocation) {
		this.deviceLocation = deviceLocation;
	}

	public String getDeviceName() {
		return deviceName;
	}

	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}

	public String getDevicePhone() {
		return devicePhone;
	}

	public void setDevicePhone(String devicePhone) {
//		this.devicePhone = devicePhone;
		
		if (deviceMsisdn.startsWith("00")) {
			this.devicePhone = deviceMsisdn.substring(2);
		} else {
			this.devicePhone = deviceMsisdn;
		}
		
		
	}

	public boolean isMasterActivated() {
		return masterActivated;
	}

	public void setMasterActivated(boolean masterActivated) {
		this.masterActivated = masterActivated;
	}

	public boolean isUserActivated() {
		return userActivated;
	}

	public void setUserActivated(boolean userActivated) {
		this.userActivated = userActivated;
	}

	public void removeUser(User user) {
		users.remove(user);
		user.getDevices().remove(this);
		user.getDevices().clear();
	}

	public boolean containsUser(User user) {
		if (this.users == null)
			return false;

		return this.users.contains(user);
	}
	
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
        this.status = status; 
	}		

	@Override
	public String toString() {
		return "ElDevice [id=" + id + ", deviceMsisdn=" + deviceMsisdn + ", devicePhone=" + devicePhone
				+ ", deviceDetails=" + deviceDetails + ", deviceLocation=" + deviceLocation + ", deviceName="
				+ deviceName + ", status=" + status + "]";
	}

}
