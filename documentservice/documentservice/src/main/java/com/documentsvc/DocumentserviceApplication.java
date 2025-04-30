package com.documentsvc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DocumentserviceApplication {

	public static void main(String[] args) {
		DotenvLoader.loadEnv();

		SpringApplication.run(DocumentserviceApplication.class, args);
	}

}
