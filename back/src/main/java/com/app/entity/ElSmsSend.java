package com.app.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import com.auth.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class ElSmsSend  implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-dd-MM hh:mm:ss")

	@Column(name = "send_date")
	private String importDate;
	
	@Column(name = "min_value")
	private int minValue;
	
	@Column(name = "max_value")
	private int maxValue;
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@ManyToOne(fetch = FetchType.LAZY)
	private ElDevice receiverDevice;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private User senderUser;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private ElCmd command;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public ElDevice getReceiverDevice() {
		return receiverDevice;
	}

	public void setReceiverDevice(ElDevice receiverDevice) {
		this.receiverDevice = receiverDevice;
	}

	public User getSenderUser() {
		return senderUser;
	}

	public void setSenderUser(User senderUser) {
		this.senderUser = senderUser;
	}

	public ElCmd getCommand() {
		return command;
	}

	public void setCommand(ElCmd command) {
		this.command = command;
	}

	
	public String getImportDate() {
		return importDate;
	}

	public void setImportDate(String importDate) {
		this.importDate = importDate;
	}

	public int getMinValue() {
		return minValue;
	}

	public void setMinValue(int minValue) {
		this.minValue = minValue;
	}

	public int getMaxValue() {
		return maxValue;
	}

	public void setMaxValue(int maxValue) {
		this.maxValue = maxValue;
	}

	@Override
	public String toString() {
		return "ElSmsSend [id=" + id + ", importDate=" + importDate + ", minValue=" + minValue + ", maxValue="
				+ maxValue + "]";
	}
	
}
