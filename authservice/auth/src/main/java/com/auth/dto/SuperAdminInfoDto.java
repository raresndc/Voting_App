package com.auth.dto;

import com.auth.model.SuperAdmin;
import lombok.Data;

@Data
public class SuperAdminInfoDto {
    private Long id;
    private String username;
    private String email;
    private int auditLevel;
    private String role;

    public static SuperAdminInfoDto from(SuperAdmin sa) {
        SuperAdminInfoDto dto = new SuperAdminInfoDto();
        dto.setId(sa.getId());
        dto.setUsername(sa.getUsername());
        dto.setEmail(sa.getEmail());
        dto.setAuditLevel(sa.getAuditLevel());
        dto.setRole(sa.getRole() != null ? sa.getRole().getName() : null);
        return dto;
    }
}
