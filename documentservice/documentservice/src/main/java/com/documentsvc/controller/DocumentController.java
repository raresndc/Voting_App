package com.documentsvc.controller;

import com.documentsvc.model.Document;
import com.documentsvc.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService service;

    // Upload PDF
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Document upload(
            Authentication auth,
            @RequestPart("file") MultipartFile file
    ) throws Exception {
        if (!MediaType.APPLICATION_PDF_VALUE.equals(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        return service.store(auth.getName(), file);
    }

    // List my documents
    @GetMapping
    public List<Document> list(Authentication auth) {
        return service.list(auth.getName());
    }

    // Download
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(Authentication auth,
                                           @PathVariable Long id) {
        Document doc = service.get(id, auth.getName());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + doc.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .body(doc.getData());
    }
}
