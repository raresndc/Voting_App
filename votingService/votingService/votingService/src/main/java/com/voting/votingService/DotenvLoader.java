package com.voting.votingService;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvLoader {

    public static void loadEnv() {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("APP_JWT_SECRET", dotenv.get("APP_JWT_SECRET"));

        System.setProperty("RSA_MODULUS", dotenv.get("RSA_MODULUS"));
        System.setProperty("RSA_PRIVATEEXP", dotenv.get("RSA_PRIVATEEXP"));
    }
}
