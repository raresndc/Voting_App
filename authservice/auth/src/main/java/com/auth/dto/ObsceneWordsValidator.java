package com.auth.dto;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;

public class ObsceneWordsValidator implements ConstraintValidator<NoObsceneWords, String> {

    private static final Set<String> OBSCENE_WORDS = Set.of(
            "badword1", "badword2", "badword3" // Add more obscene terms
    );

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true; // @NotBlank will catch null/empty
        String lowercase = value.toLowerCase();
        return OBSCENE_WORDS.stream().noneMatch(lowercase::contains);
    }
}
