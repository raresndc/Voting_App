package com.documentsvc.repository;

import com.documentsvc.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByUploadedBy(String username);
}
