package com.auth.entity;


import java.io.Serializable;

import javax.persistence.Entity;

//import javax.persistence.Entity;

@SuppressWarnings("serial")
@Entity
public class Permission extends BaseIdEntity implements Serializable {

	private String name;

	public Permission(String name) {
		super();
		this.name = name;
	}
	
	public Permission() {
		super();
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
