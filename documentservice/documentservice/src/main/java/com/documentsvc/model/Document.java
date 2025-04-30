package com.documentsvc.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String contentType;
    
    @Column(columnDefinition = "bytea")
    private byte[] data;

    private LocalDateTime uploadedAt;
    private String uploadedBy;  // will store the JWT‐username
}
