package com.example.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService {

    private final String uploadDir = "uploads/";

    public FileService() {
        // Create the upload directory if it does not exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String saveFile(MultipartFile file, String subDirectory) throws IOException {
        String targetDir = uploadDir + subDirectory;
        File directory = new File(targetDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(targetDir, fileName);
        Files.write(filePath, file.getBytes());
        return filePath.toString();
    }

    public String saveGovernmentId(MultipartFile governmentId) throws IOException {
        return saveFile(governmentId, "government_ids");
    }

    public String saveSelfie(MultipartFile selfie) throws IOException {
        return saveFile(selfie, "selfies");
    }
}
