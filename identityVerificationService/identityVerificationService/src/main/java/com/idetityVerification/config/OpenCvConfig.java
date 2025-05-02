package com.idetityVerification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;  // ← import!

import java.io.IOException;

@Configuration
public class OpenCvConfig {

    @Bean
    public CascadeClassifier faceDetector() throws IOException {
        String xmlPath = new ClassPathResource("haarcascade_frontalface_alt.xml")
                .getFile()
                .getAbsolutePath();
        return new CascadeClassifier(xmlPath);
    }
}
