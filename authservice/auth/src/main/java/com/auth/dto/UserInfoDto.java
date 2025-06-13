package com.auth.dto;

import java.time.LocalDate;
import lombok.Value;

@Value
public class UserInfoDto {
    int       age;
    String    citizenship;
    LocalDate dateOfBirth;
    String    gender;
    String    lastName;
    String    firstName;
    String    idSeries;
}
