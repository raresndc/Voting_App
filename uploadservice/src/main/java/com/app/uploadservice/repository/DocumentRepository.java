package com.app.uploadservice.repository;

import java.util.List;

import com.app.uploadservice.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAll();
    List<Document> findAllByUploadedBy(String username);
}
