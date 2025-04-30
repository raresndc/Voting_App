package com.app.uploadservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    private String title;
//    private String description;
//
//    @Lob
//    private byte[] content;
//
//    @Lob
//    private String textContent; // New field for storing text content

    private String filename;
    private String contentType;

    @Lob
    @Column(columnDefinition = "bytea")
    private byte[] data;

    private LocalDateTime uploadedAt;
    private String uploadedBy;  // will store the JWT‐username
}

