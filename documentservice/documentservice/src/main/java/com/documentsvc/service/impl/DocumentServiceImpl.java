package com.documentsvc.service.impl;

import com.documentsvc.model.Document;
import com.documentsvc.repository.DocumentRepository;
import com.documentsvc.service.DocumentService;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository repo;

    public Document store(String username, MultipartFile file) throws Exception {
        byte[] bytes = file.getBytes();
        String text = "";

        // Try PDFBox text extraction first
        try (PDDocument pdf = PDDocument.load(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            text = stripper.getText(pdf).trim();

            // If that produced nothing, fall back to OCR
            if (text.isBlank()) {
                PDFRenderer renderer = new PDFRenderer(pdf);
                ITesseract ocr = new Tesseract();

                // explicitly point to the parent of tessdata
                String tessPath = Dotenv.load().get("TESSDATA_PREFIX");
                ocr.setDatapath(tessPath);
                ocr.setLanguage("eng");

                StringBuilder sb = new StringBuilder();

                for (int page = 0; page < pdf.getNumberOfPages(); page++) {
                    BufferedImage image = renderer.renderImageWithDPI(page, 300);
                    try {
                        String ocrResult = ocr.doOCR(image);
                        sb.append(ocrResult).append("\n");
                    } catch (TesseractException e) {
                        log.warn("OCR failed on page {}: {}", page, e.getMessage());
                    }
                }
                text = sb.toString().trim();
            }
        }

        log.info("Extracted text: {}", text);

        Document doc = Document.builder()
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .data(bytes)
                .textContent(text)
                .uploadedAt(LocalDateTime.now())
                .uploadedBy(username)
                .build();

        return repo.save(doc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> list(String username) {
        return repo.findAllByUploadedBy(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Document get(Long id, String username) {
        Document doc = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        if (!doc.getUploadedBy().equals(username)) {
            throw new SecurityException("Access denied");
        }
        return doc;
    }
}
