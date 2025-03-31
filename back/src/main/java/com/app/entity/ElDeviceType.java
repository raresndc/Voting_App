package com.app.entity;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class ElDeviceType implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "device_type_name", columnDefinition = "VARCHAR(50)")
	private String deviceTypeName;

	@Column(name = "device_type_details", columnDefinition = "VARCHAR(100)")
	private String deviceTypeDetails;

	@Column(name = "lider", columnDefinition = "VARCHAR(100)")
	private String lider;

	@Column(name = "pozitie", columnDefinition = "VARCHAR(100)")
	private String pozitie;

	@Column(name = "ideologie", columnDefinition = "VARCHAR(10000)")
	private String ideologie;

	@Column(name = "statut", columnDefinition = "VARCHAR(100)")
	private String statut;

	@Column(name = "membrii_senat", columnDefinition = "VARCHAR(100)")
	private String membriiSenat;

	@Column(name = "membrii_cam_dep", columnDefinition = "VARCHAR(100)")
	private String membriiCamDdep;

	@Column(name = "membrii_parla_euro", columnDefinition = "VARCHAR(100)")
	private String membriiParlaEuro;

	@OneToMany(mappedBy = "elDevice", cascade = CascadeType.ALL)
	private List<ElCmd> elCmd;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToMany(mappedBy = "elDeviceType", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ElDevice> elDevice;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDeviceTypeName() {
		return deviceTypeName;
	}

	public void setDeviceTypeName(String deviceTypeName) {
		this.deviceTypeName = deviceTypeName;
	}

	public String getDeviceTypeDetails() {
		return deviceTypeDetails;
	}

	public void setDeviceTypeDetails(String deviceTypeDetails) {
		this.deviceTypeDetails = deviceTypeDetails;
	}

	public ElDeviceType() {

	}

	public ElDeviceType(String deviceTypeName, String deviceTypeDetails) {
		this.deviceTypeName = deviceTypeName;
		this.deviceTypeDetails = deviceTypeDetails;
	}

	public String getLider() {
		return lider;
	}

	public void setLider(String lider) {
		this.lider = lider;
	}

	public String getPozitie() {
		return pozitie;
	}

	public void setPozitie(String pozitie) {
		this.pozitie = pozitie;
	}

	public String getIdeologie() {
		return ideologie;
	}

	public void setIdeologie(String ideologie) {
		this.ideologie = ideologie;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public String getMembriiSenat() {
		return membriiSenat;
	}

	public void setMembriiSenat(String membriiSenat) {
		this.membriiSenat = membriiSenat;
	}

	public String getMembriiCamDdep() {
		return membriiCamDdep;
	}

	public void setMembriiCamDdep(String membriiCamDdep) {
		this.membriiCamDdep = membriiCamDdep;
	}

	public String getMembriiParlaEuro() {
		return membriiParlaEuro;
	}

	public void setMembriiParlaEuro(String membriiParlaEuro) {
		this.membriiParlaEuro = membriiParlaEuro;
	}

	@Override
	public String toString() {
		return "ElDeviceType [id=" + id + ", deviceTypeName=" + deviceTypeName + ", deviceTypeDetails="
				+ deviceTypeDetails + ", lider=" + lider + ", pozitie=" + pozitie + ", ideologie=" + ideologie
				+ ", statut=" + statut + ", membriiSenat=" + membriiSenat + ", membriiCamDdep=" + membriiCamDdep
				+ ", membriiParlaEuro=" + membriiParlaEuro + ", elCmd=" + elCmd + ", elDevice=" + elDevice + "]";
	}

}
