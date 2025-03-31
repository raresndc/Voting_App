package com.app.entity;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PostPersist;

import com.app.component.DataBaseTriggers;
import com.auth.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@EntityListeners(DataBaseTriggers.class)
public class ElSmsReceived  implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "status")
	private String statusMsg;

	@Column(name = "msg_content", length = 100000)
	private String content;

	@Column(name = "sql_import_date")
	private Timestamp importDate;

	@Column(name = "msg_sent_date")
	private String msgDate;

	@ManyToOne(fetch = FetchType.LAZY)
	
	private ElDevice elDevice;

	public ElDevice getElDevice() {
		return elDevice;
	}

	public void setElDevice(ElDevice elDevice) {
		this.elDevice = elDevice;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Timestamp getImportDate() {
		return importDate;
	}

	public void setImportDate(Timestamp importDate) {
		this.importDate = importDate;
	}


	public String getStatusMsg() {
		return statusMsg;
	}

	public void setStatusMsg(String statusMsg) {
		this.statusMsg = statusMsg;
	}

	public String getMsgDate() {
		return msgDate;
	}

	public void setMsgDate(String msgDate) {
		this.msgDate = msgDate;
	}

	public ElSmsReceived() {
		super();
	}

	public ElSmsReceived(Long id, String statusMsg, String content, Timestamp importDate, String msgDate,
			ElDevice elDevice) {
		super();
		this.id = id;
		this.statusMsg = statusMsg;
		this.content = content;
		this.importDate = importDate;
		this.msgDate = msgDate;
		this.elDevice = elDevice;
	}

	@Override
	public String toString() {
		return "ElSmsReceived [id=" + id + ", statusMsg=" + statusMsg + ", content=" + content + ", importDate="
				+ importDate + ", msgDate=" + msgDate + "]";
	}
	
	

}




