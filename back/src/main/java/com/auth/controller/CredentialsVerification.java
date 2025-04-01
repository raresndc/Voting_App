package com.auth.controller;

import java.util.regex.Pattern;

import com.auth.exception.BadCredentialsException;

public class CredentialsVerification {
	
	private static String credentialsRegex = "(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}";
	
	private static Pattern credentialValidator = Pattern.compile(credentialsRegex); 
	
	public static void checkPasswordConstrains(String password) throws BadCredentialsException {
		
		if(!credentialValidator.matcher(password).matches()) {
			throw new BadCredentialsException("Parola nu respecta constrangerile."
					+ " Litera mica, litera mare, cifra, caracter special,"
					+ " dimensiune minim 8 caractere, dimensiune maxima 24 de caractere!");
		}	
	}
	
	public static void checkUsernameContrains(String username) throws BadCredentialsException {
		
		if(username.trim().length() == 0) {
			throw new BadCredentialsException("Usernameul nu contine caractere!");
		}	
	}
}
