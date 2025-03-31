package com.auth.util;

import java.nio.charset.Charset;
import java.util.Base64;

public class Utils {

	public static String getBasicAuth(String username, String password){

		String auth = username + ":" + password;
		byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(Charset.forName("US-ASCII")));
		String authHeader = "Basic " + new String( encodedAuth );
		return authHeader;
	}

}
