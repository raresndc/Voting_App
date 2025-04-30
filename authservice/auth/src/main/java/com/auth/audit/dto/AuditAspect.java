package com.auth.audit.dto;

import com.auth.audit.model.AuditLog;
import com.auth.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {
    private final AuditLogRepository auditRepo;

    @Before("@annotation(auditable)")
    public void recordAudit(JoinPoint jp, Auditable auditable) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String user = auth != null ? auth.getName() : "anonymous";

        String targetId = "";
        if (!auditable.targetIdArg().isEmpty()) {
            for (var arg : jp.getArgs()) {
                if (arg instanceof Map<?,?> && auditable.targetIdArg().equals("id")) {
                    targetId = ((Map<?,?>)arg).get("id").toString();
                }
                // or inspect method signature via reflection to pull named param…
            }
        }

        AuditLog log = AuditLog.builder()
                .username(user)
                .action(auditable.action())
                .targetType(auditable.targetType())
                .targetId(targetId)
                .timestamp(LocalDateTime.now())
                .details("")  // optionally serialize all args or a subset
                .build();

        auditRepo.save(log);
    }
}
