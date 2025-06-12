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

//    private String serialNumber;
//    private String lastName;
//    private String firstName;
//    private String nationality;
//    private String sex;
//    private LocalDateTime expiryDate;
//    private String isValid;
//    private String address;
//    private String dob;
//    private String cnp;
}
