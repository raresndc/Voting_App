package com.auth.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailService {

    @Value("${spring.mail.username}")
    private String email;

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String recipientEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }

    public void sendVerificationEmail(String recipientEmail, String code) {
        sendEmail(
                recipientEmail,
                "Account Verification Code",
                "Your verification code is: " + code
        );
    }
}
