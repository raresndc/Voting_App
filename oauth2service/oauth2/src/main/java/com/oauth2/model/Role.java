package com.oauth2.model;

import com.oauth2.util.RoleName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {
    @Id
    @Enumerated(EnumType.STRING)
    private RoleName name;
}
