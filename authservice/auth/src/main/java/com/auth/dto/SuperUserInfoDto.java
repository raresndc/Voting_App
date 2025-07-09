package com.auth.dto;

import com.auth.model.SuperUser;
import lombok.Data;

@Data
public class SuperUserInfoDto {
    private Long id;
    private String username;
    private String email;
    private int auditLevel;
    private String role;
    private String politicalParty;

    public static SuperUserInfoDto from(SuperUser su) {
        SuperUserInfoDto dto = new SuperUserInfoDto();
        dto.setId(su.getId());
        dto.setUsername(su.getUsername());
        dto.setEmail(su.getEmail());
        dto.setAuditLevel(su.getAuditLevel());
        dto.setRole(su.getRole() != null ? su.getRole().getName() : null);
        dto.setPoliticalParty(su.getPoliticalParty() != null ? su.getPoliticalParty().getName() : null);
        return dto;
    }
}
