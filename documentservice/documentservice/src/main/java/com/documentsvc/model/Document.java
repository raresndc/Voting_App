package com.documentsvc.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String contentType;

    @Column(columnDefinition = "bytea")
    private byte[] data;

    @Column(columnDefinition = "text")
    private String textContent;

    private LocalDateTime uploadedAt;
    private String uploadedBy;  // will store the JWT‐username

    private boolean isValid;
    private String nationality;
    private String lastName;
    private String firstName;
    private String series;
    private String sex;
    private LocalDateTime expiryDate;
    private LocalDateTime issueDate;
    private LocalDate dateOfBirth;

    private boolean verifiedInfo;
}
