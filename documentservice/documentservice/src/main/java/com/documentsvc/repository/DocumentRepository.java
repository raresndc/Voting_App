package com.documentsvc.repository;

import com.documentsvc.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByUploadedBy(String username);
    Optional<Document> findTopByUploadedByOrderByUploadedAtDesc(String username);
}
