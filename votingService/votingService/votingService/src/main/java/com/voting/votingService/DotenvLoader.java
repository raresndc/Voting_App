package com.voting.votingService;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvLoader {

    public static void loadEnv() {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("APP_JWT_SECRET", dotenv.get("APP_JWT_SECRET"));
    }
}
