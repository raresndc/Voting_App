package com.app.uploadservice.repository;

import java.util.List;

import com.app.uploadservice.entity.DocumentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentInfoRepository extends JpaRepository<DocumentInfo, Long> {

    List<DocumentInfo> findAll();
}
