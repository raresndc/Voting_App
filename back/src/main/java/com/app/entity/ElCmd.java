package com.app.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class ElCmd implements Serializable  {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "cmd_name", columnDefinition = "VARCHAR(50)")
	private String cmdName;

	@Column(name = "cmd_syntax", columnDefinition = "VARCHAR(50)")
	private String cmdSyntax;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@ManyToOne(fetch = FetchType.LAZY)
	private ElDeviceType elDevice;
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToMany(mappedBy = "command", cascade = CascadeType.ALL, orphanRemoval = true) 
	private List<ElSmsSend> elSmsSend;

	 public ElCmd() {}

	  public ElCmd(String cmdName, String cmdSyntax) {
	    this.cmdName= cmdName;
	    this.cmdSyntax = cmdSyntax;
	    
	  }
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ElSmsSend> getElSmsSend() {
		return elSmsSend;
	}

	public void setElSmsSend(List<ElSmsSend> elSmsSend) {
		this.elSmsSend = elSmsSend;
	}

	public String getCmdName() {
		return cmdName;
	}

	public void setCmdName(String cmdName) {
		this.cmdName = cmdName;
	}
	
	public String getCmdSyntax() {
		return cmdSyntax;
	}

	public void setCmdSyntax(String cmdSyntax) {
		this.cmdSyntax = cmdSyntax;
	}
	
	public ElDeviceType getElDevice() {
		return elDevice;
	}

	public void setElDevice(ElDeviceType elDevice) {
		this.elDevice = elDevice;
	}

	@Override
	public String toString() {
		return "ElCmd [id=" + id + ", cmdName=" + cmdName + ", cmdSyntax=" + cmdSyntax + ", elDevice=" + elDevice
				+ ", elSmsSend=" + elSmsSend + "]";
	}
}
