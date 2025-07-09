package com.auth.dto;

import com.auth.model.Candidate;
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
    private Long votes;
    private Long id;

    public CandidateDTO(String firstName, String lastName, Integer age, String politicalParty, String photo, Long votes) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.politicalParty = politicalParty;
        this.photo = photo;
        this.votes = votes;
    }

    public CandidateDTO(Long id, String firstName, String lastName, String gender, LocalDate dob, Integer age, String politicalParty, String description, String photo) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dob = dob;
        this.age = age;
        this.politicalParty = politicalParty;
        this.description = description;
        this.photo = photo;
        this.id = id;
    }

    public static CandidateDTO from(Candidate candidate) {
        CandidateDTO dto = new CandidateDTO();
        dto.setId(candidate.getId());
        dto.setFirstName(candidate.getFirstName());
        dto.setLastName(candidate.getLastName());
        dto.setGender(candidate.getGender());
        dto.setPoliticalParty(candidate.getPoliticalParty() != null ? candidate.getPoliticalParty().getName() : null);
        dto.setPhoto(candidate.getPhoto());
        dto.setAge(candidate.getAge());
        dto.setDescription(candidate.getDescription());
        // ... set other fields as needed
        return dto;
    }
}
