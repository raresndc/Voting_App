package com.app.entity;

import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.*;

@Entity
public class ElRouter  implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "router_name", columnDefinition = "VARCHAR(50)")
	private String routerName;

	@Column(name = "router_details", columnDefinition = "VARCHAR(100)")
	private String routerDetails;

	@Column(name = "router_syntax", columnDefinition = "VARCHAR(15)")
	private String routerSyntax;

	@Column(name = "router_ip", columnDefinition = "VARCHAR(15)")
	private String routerIp;

	@Column(name = "router_Username", columnDefinition = "VARCHAR(20)")
	private String routerUsername;

	@Column(name = "router_Password", columnDefinition = "VARCHAR(30)")
	private String routerPassword;

	@Column(name ="is_device_router", columnDefinition = "BOOLEAN")
	private boolean communicationDeviceRouter;
	
	@Column(name = "status", columnDefinition = "VARCHAR(20)")
    private String status;
	
	@Column(name = "tip_router", columnDefinition = "VARCHAR(20)")
    private String tipRouter;
	
	private String routerPhone;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToMany(mappedBy = "masterRouter", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ElDevice> elSlaves;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToMany(mappedBy = "elRouter",  cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ElDevice> elUser;

	public ElRouter() {}

	public ElRouter(String routerName, String routerDetails, String routerSyntax, String routerIp,
			String routerUsername, String routerPassword, boolean communicationDeviceRouter, String routerPhone,
			List<ElDevice> elSlaves, List<ElDevice> elUser) {
		super();
		this.routerName = routerName;
		this.routerDetails = routerDetails;
		this.routerSyntax = routerSyntax;
		this.routerIp = routerIp;
		this.routerUsername = routerUsername;
		this.routerPassword = routerPassword;
		this.communicationDeviceRouter = communicationDeviceRouter;
		this.routerPhone = routerPhone;
		this.elSlaves = elSlaves;
		this.elUser = elUser;
	}

	public List<ElDevice> getElSlaves() {
		return elSlaves;
	}

	public void setElSlaves(List<ElDevice> elSlaves) {
		this.elSlaves = elSlaves;
	}

	public List<ElDevice> getElUser() {
		return elUser;
	}

	public void setElUser(List<ElDevice> elUser) {
		this.elUser = elUser;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public boolean isCommunicationDeviceRouter() {
		return communicationDeviceRouter;
	}

	public void setCommunicationDeviceRouter(boolean communicationDeviceRouter) {
		this.communicationDeviceRouter = communicationDeviceRouter;
	}

	public String getRouterName() {
		return routerName;
	}

	public void setRouterName(String routerName) {
		this.routerName = routerName;
	}

	public String getRouterDetails() {
		return routerDetails;
	}

	public void setRouterDetails(String routerDetails) {
		this.routerDetails = routerDetails;
	}

	public String getRouterSyntax() {
		return routerSyntax;
	}

	public void setRouterSyntax(String routerSyntax) {
		this.routerSyntax = routerSyntax;
	}

	public String getRouterIp() {
		return routerIp;
	}

	public void setRouterIp(String routerIp) {
		this.routerIp = routerIp;
	}

	public String getRouterUsername() {
		return routerUsername;
	}

	public void setRouterUsername(String routerUsername) {
		this.routerUsername = routerUsername;
	}

	public String getRouterPassword() {
		return routerPassword;
	}

	public void setRouterPassword(String routerPassword) {

		this.routerPassword = routerPassword;
	}

	public String getRouterPhone() {
		return routerPhone;
	}

	public void setRouterPhone(String routerPhone) {
		if(routerPhone != null) {
			if (!routerPhone.startsWith("004")) {
				routerPhone = "004" + routerPhone;
			}
		}
		this.routerPhone = routerPhone;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	
	

	public String getTipRouter() {
		return tipRouter;
	}

	public void setTipRouter(String tipRouter) {
		this.tipRouter = tipRouter;
	}

	@Override
	public String toString() {
		return "ElRouter [id=" + id + ", routerName=" + routerName + ", routerDetails=" + routerDetails
				+ ", routerSyntax=" + routerSyntax + ", routerIp=" + routerIp + ", routerUsername=" + routerUsername
				+ ", routerPassword=" + routerPassword + ", communicationDeviceRouter=" + communicationDeviceRouter
				+ ", status=" + status + ", tipRouter=" + tipRouter + ", routerPhone=" + routerPhone + ", elSlaves="
				+ elSlaves + ", elUser=" + elUser + "]";
	}

	

}
