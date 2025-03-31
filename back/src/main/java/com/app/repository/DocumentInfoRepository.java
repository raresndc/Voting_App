package com.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.entity.DocumentInfo;

@Repository
public interface DocumentInfoRepository extends JpaRepository<DocumentInfo, Long> {

    List<DocumentInfo> findAll();
}
