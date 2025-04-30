package com.app.uploadservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UploadserviceApplication {

	public static void main(String[] args) {
		DotenvLoader.loadEnv();

		SpringApplication.run(UploadserviceApplication.class, args);
	}

}
