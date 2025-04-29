package com.auth.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ObsceneWordsValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface NoObsceneWords {
    String message() default "Username contains inappropriate language";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
