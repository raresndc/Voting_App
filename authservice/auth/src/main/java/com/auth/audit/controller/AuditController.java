package com.auth.audit.controller;

import com.auth.audit.model.AuditLog;
import com.auth.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
public class AuditController {
    private final AuditLogRepository auditRepo;

    @GetMapping
    public List<AuditLog> all() {
        return auditRepo.findAll(Sort.by("timestamp").descending());
    }
}

