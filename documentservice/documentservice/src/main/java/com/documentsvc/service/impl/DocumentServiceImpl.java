package com.documentsvc.service.impl;

import com.documentsvc.model.Document;
import com.documentsvc.repository.DocumentRepository;
import com.documentsvc.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository repo;

    @Override
    public Document store(String username, MultipartFile file) throws Exception {
        Document doc = Document.builder()
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .data(file.getBytes())
                .uploadedAt(LocalDateTime.now())
                .uploadedBy(username)
                .build();
        return repo.save(doc);
    }

    @Override
    public List<Document> list(String username) {
        return repo.findAllByUploadedBy(username);
    }

    @Override
    public Document get(Long id, String username) {
        Document doc = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        if (!doc.getUploadedBy().equals(username)) {
            throw new SecurityException("Access denied");
        }
        return doc;
    }
}
