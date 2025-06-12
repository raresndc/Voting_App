package com.documentsvc.controller;

import com.documentsvc.model.Document;
import com.documentsvc.service.DocumentOcrService;
import com.documentsvc.service.DocumentService;
import com.documentsvc.service.PhotoExtractionService;
import lombok.RequiredArgsConstructor;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.awt.image.BufferedImage;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    @Value("${tesseract.datapath}")
    private String tessDataPath;

    private final DocumentService service;
    private final DocumentOcrService ocrService;
    private final PhotoExtractionService photoSvc;

    // Upload PDF
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Document upload(
            Authentication auth,
            @RequestPart("file") MultipartFile file
    ) throws Exception {
        if (!MediaType.APPLICATION_PDF_VALUE.equals(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        return ocrService.ingest(auth.getName(), file);
    }

    @PostMapping(path="/ocr/text", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public Document ocrAndSave(
            Authentication auth,
            @RequestPart("file") MultipartFile file
    ) throws Exception {
        BufferedImage bi   = photoSvc.loadAsBufferedImage(file);

        Tesseract tess = new Tesseract();
        tess.setDatapath(tessDataPath);
        tess.setLanguage("eng+ron+fra");
        String ocrText = tess.doOCR(bi);

        return ocrService.saveOcr(file, ocrText, auth.getName());
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
