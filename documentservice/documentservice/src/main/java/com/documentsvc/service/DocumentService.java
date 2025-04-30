package com.documentsvc.service;

import com.documentsvc.model.Document;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface DocumentService {
    Document store(String username, MultipartFile file) throws Exception;
    List<Document> list(String username);
    Document get(Long id, String username);
}
