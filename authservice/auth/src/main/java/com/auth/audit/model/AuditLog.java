package com.auth.audit.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String action;          // e.g. “REGISTER”, “LOGIN_SUCCESS”, “PRODUCT_DELETE”
    private String targetType;      // e.g. “User”, “Product”
    private String targetId;        // the entity’s ID or other descriptor
    private LocalDateTime timestamp;
    @Lob
    private String details;         // JSON or free-text payload
}
