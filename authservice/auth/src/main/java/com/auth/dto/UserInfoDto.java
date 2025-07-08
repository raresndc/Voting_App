package com.auth.dto;

import java.time.LocalDate;

import com.auth.model.User;
import lombok.*;

public class UserInfoDto {
    int       age;
    String    citizenship;
    LocalDate dateOfBirth;
    String    gender;
    String    lastName;
    String    firstName;
    String    idSeries;
    Boolean   verified;

    public UserInfoDto() {
    }

    public UserInfoDto(int age, String citizenship, LocalDate dateOfBirth, String gender, String lastName, String firstName, String idSeries, Boolean verified) {
        this.age = age;
        this.citizenship = citizenship;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.lastName = lastName;
        this.firstName = firstName;
        this.idSeries = idSeries;
        this.verified = verified;
    }

    public int getAge() {
        return age;
    }

    public String getCitizenship() {
        return citizenship;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getIdSeries() {
        return idSeries;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setCitizenship(String citizenship) {
        this.citizenship = citizenship;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setIdSeries(String idSeries) {
        this.idSeries = idSeries;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public static UserInfoDto from(User user) {
        UserInfoDto dto = new UserInfoDto();
        dto.setAge(user.getAge());
        dto.setCitizenship(user.getCitizenship());
        dto.setDateOfBirth(user.getDob());
        dto.setGender(user.getGender());
        dto.setLastName(user.getLastName());
        dto.setFirstName(user.getFirstName());
        dto.setIdSeries(user.getIDseries());
        dto.setVerified(user.isVerified());
        return dto;
    }
}
