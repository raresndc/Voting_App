package com.app.service;

import java.io.IOException;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.component.PDFUtil;
import com.app.entity.DocumentInfo;
import com.app.repository.DocumentInfoRepository;


@Service
public class DocumentInfoService {

    @Autowired
    private DocumentInfoRepository documentInfoRepository;

    public DocumentInfo storeDocument(String title, String description, MultipartFile file) throws IOException {
        byte[] content = file.getBytes();
        DocumentInfo document = new DocumentInfo(title, description, content);

        // Convert PDF content to text
        String textContent = "";
        if (file.getOriginalFilename() != null && file.getOriginalFilename().endsWith(".pdf")) {
            textContent = PDFUtil.extractTextFromPDF(content);
        }

        document.setTextContent(textContent);

        return documentInfoRepository.save(document);
    }

    public DocumentInfo getDocumentById(Long id) {
        return documentInfoRepository.findById(id).orElse(null);
    }
    
    @Transactional
    public List<DocumentInfo> getAllDocuments() {
        return documentInfoRepository.findAll();
    }
}
