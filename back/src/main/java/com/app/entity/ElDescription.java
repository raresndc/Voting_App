package com.app.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ElDescription implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "info_1", columnDefinition = "VARCHAR(100)")
	private String info1;

	@Column(name = "info_2", columnDefinition = "VARCHAR(100)")
	private String info2;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getInfo1() {
		return info1;
	}

	public void setInfo1(String info1) {
		this.info1 = info1;
	}

	public String getInfo2() {
		return info2;
	}

	public void setInfo2(String info2) {
		this.info2 = info2;
	}

	public ElDescription() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ElDescription(String info1, String info2) {
		super();
		this.info1 = info1;
		this.info2 = info2;
	}
	
}
