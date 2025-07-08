package com.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDTO {
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dob;
    private Integer age;
    private String politicalParty;
    private String description;
    private String photo;
}
