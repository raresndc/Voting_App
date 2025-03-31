package com.auth.exception;

public class CustomException extends Exception {

	/**
	 *	Custom exception 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final int ACCOUNT_ALREADY_EXIST = 1;
	
	public static final int PASSWORD_DOESNT_MATCH = 2;
	
	public static final int INCORECT_ROLE = 3;
	
	public static final int BAD_CREDENTIALS = 4;
	
	public static final int USER_DOESNT_EXIST = 5;
	
	public int exceptionCode;
	
	public CustomException(int code, String msg){
		super(msg);
	}

}
