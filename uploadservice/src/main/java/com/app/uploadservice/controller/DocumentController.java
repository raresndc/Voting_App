package com.app.uploadservice.controller;

//import java.io.IOException;
//import java.util.List;
//
//import com.app.uploadservice.entity.Document;
//import com.app.uploadservice.service.DocumentService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//
//import org.springframework.core.io.Resource;
//import org.springframework.http.HttpHeaders;
//
//import org.springframework.core.io.ByteArrayResource;
//import org.springframework.http.MediaType;
//
//
//@RestController
//@RequestMapping("/documents")
//@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000, allowedHeaders = "*")
//public class DocumentController {
//
//    @Autowired
//    private DocumentService documentService;
//
//    @PostMapping("/upload")
//    public ResponseEntity<Document> uploadDocument(
//            @RequestParam("title") String title,
//            @RequestParam("description") String description,
//            @RequestParam("file") MultipartFile file
//    ) {
//        try {
//            Document savedDocument = documentService.storeDocument(title, description, file);
//            return ResponseEntity.status(HttpStatus.CREATED).body(savedDocument);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
//
////    @GetMapping("/{id}")
////    public ResponseEntity<DocumentInfo> getDocumentById(@PathVariable Long id) {
////        DocumentInfo document = documentInfoService.getDocumentById(id);
////        if (document != null) {
////            return ResponseEntity.ok(document);
////        } else {
////            return ResponseEntity.notFound().build();
////        }
////    }
//
//    @GetMapping("/download/{id}")
//    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
//        Document document = documentService.getDocumentById(id);
//
//        if (document == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        // Create a ByteArrayResource from the document content
//        ByteArrayResource resource = new ByteArrayResource(document.getContent());
//
//        // Set the content type based on file extension
//        MediaType mediaType = determineMediaType(document.getTitle());
//
//        // Set headers for file download
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(mediaType);
//        headers.setContentDispositionFormData("attachment", document.getTitle());
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(resource);
//    }
//
//    // Method to determine MediaType based on file extension
//    private MediaType determineMediaType(String fileName) {
//        String[] parts = fileName.split("\\.");
//        if (parts.length > 0) {
//            String extension = parts[parts.length - 1].toLowerCase();
//            switch (extension) {
//                case "pdf":
//                    return MediaType.APPLICATION_PDF;
//                case "doc":
//                case "docx":
//                    // Use generic binary stream for Word documents
//                    return MediaType.APPLICATION_OCTET_STREAM;
//                case "txt":
//                    return MediaType.TEXT_PLAIN;
//                // Add more cases for other file types as needed
//                default:
//                    return MediaType.APPLICATION_OCTET_STREAM;
//            }
//        }
//        return MediaType.APPLICATION_OCTET_STREAM;
//    }
//
//
//
//    @GetMapping("/all")
//    public ResponseEntity<List<Document>> getAllDocuments() {
//        List<Document> documents = documentService.getAllDocuments();
//        if (!documents.isEmpty()) {
//            return ResponseEntity.ok(documents);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//}

import com.app.uploadservice.entity.Document;
import com.app.uploadservice.service.DocumentService;
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
    @PostMapping
    public Document upload(Authentication auth,
                           @RequestParam("file") MultipartFile file) throws Exception {
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