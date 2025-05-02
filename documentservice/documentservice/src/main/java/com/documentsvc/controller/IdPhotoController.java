package com.documentsvc.controller;

import com.documentsvc.service.IdPhotoCacheService;
import com.documentsvc.service.PhotoExtractionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/api/id-photo")
public class IdPhotoController {
    private final PhotoExtractionService extractor;
    private final IdPhotoCacheService cache;

    public IdPhotoController(
            PhotoExtractionService extractor,
            IdPhotoCacheService cache
    ) {
        this.extractor = extractor;
        this.cache = cache;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> uploadAndCache(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        byte[] photoPng = extractor.extractPhoto(file);
        cache.savePhoto(userId, photoPng);

        return ResponseEntity
                .created(URI.create("/api/id-photo/" + userId))
                .build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<byte[]> getFromCache(
            @PathVariable String userId
    ) {
        byte[] photo = cache.getPhoto(userId);
        if (photo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(photo);
    }
}