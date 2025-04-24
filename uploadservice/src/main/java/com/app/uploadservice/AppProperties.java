package com.app.uploadservice;

import lombok.Getter;
import lombok.Setter;
import lombok.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties
@Getter
@Setter
public class AppProperties {
    private List<String> allowedOrigins = List.of("https://localhost:3000");

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Value("${app.web.allowed-origins}")
    private String appWeb;
}
