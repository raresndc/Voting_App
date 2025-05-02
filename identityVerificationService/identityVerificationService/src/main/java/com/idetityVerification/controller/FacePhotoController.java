package com.idetityVerification.controller;

import com.idetityVerification.service.FaceExtractionService;
import com.idetityVerification.service.FacePhotoCacheService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/api/face-photo")
public class FacePhotoController {

    private final FaceExtractionService extractor;
    private final FacePhotoCacheService cache;

    public FacePhotoController(
            FaceExtractionService extractor,
            FacePhotoCacheService cache
    ) {
        this.extractor = extractor;
        this.cache = cache;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> uploadAndCache(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        byte[] facePng = extractor.extractFace(file);  // matches service method name
        cache.save(userId, facePng);
        return ResponseEntity
                .created(URI.create("/api/face-photo/" + userId))
                .build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<byte[]> getFromCache(
            @PathVariable String userId
    ) {
        byte[] face = cache.get(userId);
        if (face == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(face);
    }
}
