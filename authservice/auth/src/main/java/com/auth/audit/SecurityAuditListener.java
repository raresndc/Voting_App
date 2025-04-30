package com.auth.audit;

import com.auth.audit.model.AuditLog;
import com.auth.audit.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SecurityAuditListener {

    @Autowired
    private AuditLogRepository auditRepo;

    @EventListener
    public void onAuthSuccess(AuthenticationSuccessEvent evt) {
        String user = evt.getAuthentication().getName();
        auditRepo.save(new AuditLog(
                null, user, "LOGIN_SUCCESS", "User", user, LocalDateTime.now(), ""
        ));
    }

    @EventListener
    public void onAuthFailure(AbstractAuthenticationFailureEvent evt) {
        String user = evt.getAuthentication().getName();
        auditRepo.save(new AuditLog(
                null, user, "LOGIN_FAILURE", "User", user, LocalDateTime.now(), evt.getException().getMessage()
        ));
    }
}
