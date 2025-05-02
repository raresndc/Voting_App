package com.idetityVerification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IdentityVerificationServiceApplication {

	public static void main(String[] args) {
		DotenvLoader.loadEnv();

		SpringApplication.run(IdentityVerificationServiceApplication.class, args);
	}

}
