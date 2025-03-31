package com.auth.model;

public class TokenRequest {

	private String token;
	
	public TokenRequest(String token) {
		super();
		this.token = token;
	}
	
	public TokenRequest() {
		super();
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
}
