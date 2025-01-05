package com.example.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailSenderService {

    private static final Logger log = LoggerFactory.getLogger(EmailSenderService.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.host}")
    String mail_host;

    @Value("${spring.mail.port}")
    int mail_port;

    @Value("${spring.mail.username}")
    String mail_username;

    @Value("${spring.mail.password}")
    String mail_password;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Verification Code");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
        return "OTP sent via email to: " + toEmail;
    }
}
