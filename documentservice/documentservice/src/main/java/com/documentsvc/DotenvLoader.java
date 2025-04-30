package com.documentsvc;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvLoader {

    public static void loadEnv() {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("SPRING_DATASOURCE_USERNAME", dotenv.get("SPRING_DATASOURCE_USERNAME"));
        System.setProperty("SPRING_DATASOURCE_PASSWORD", dotenv.get("SPRING_DATASOURCE_PASSWORD"));

        System.setProperty("APP_JWT_SECRET", dotenv.get("APP_JWT_SECRET"));

        System.setProperty("TESSDATA_PREFIX", dotenv.get("TESSDATA_PREFIX"));
    }
}
