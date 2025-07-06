package com.voting.votingService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VotingServiceApplication {

	public static void main(String[] args) {
		DotenvLoader.loadEnv();

		SpringApplication.run(VotingServiceApplication.class, args);
	}

}
