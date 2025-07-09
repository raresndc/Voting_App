package com.auth.dto;

import lombok.Data;

@Data
public class UpdateCandidateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String dob;
    private Integer age;
    private String IDseries;
}
