package com.app.uploadservice.service;

import java.io.IOException;
import java.util.List;

import javax.transaction.Transactional;

import com.app.uploadservice.entity.Document;
import com.app.uploadservice.repository.DocumentRepository;
import com.app.uploadservice.util.PDFUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


//@Service
//public class DocumentService {
//
//    @Autowired
//    private DocumentRepository documentRepository;
//
//    public Document storeDocument(String title, String description, MultipartFile file) throws IOException {
//        byte[] content = file.getBytes();
//        Document document = new Document(title, description, content);
//
//        // Convert PDF content to text
//        String textContent = "";
//        if (file.getOriginalFilename() != null && file.getOriginalFilename().endsWith(".pdf")) {
//            textContent = PDFUtil.extractTextFromPDF(content);
//        }
//
//        document.setTextContent(textContent);
//
//        return documentRepository.save(document);
//    }
//
//    public Document getDocumentById(Long id) {
//        return documentRepository.findById(id).orElse(null);
//    }
//
//    @Transactional
//    public List<Document> getAllDocuments() {
//        return documentRepository.findAll();
//    }
//}

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface DocumentService {
    Document store(String username, MultipartFile file) throws Exception;
    List<Document> list(String username);
    Document get(Long id, String username);
}
