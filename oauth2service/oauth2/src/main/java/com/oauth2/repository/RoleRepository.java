package com.oauth2.repository;

import com.oauth2.model.Role;
import com.oauth2.util.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, RoleName> {
}
