package com.auth.model;

public class ResponseUser {
	
	private String response;
	
	private String message;
	
	public ResponseUser(String response, String message) {
		super();
		this.response = response;
		this.message = message;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "[response=" + response + ", message=" + message + "]";
	}
}
