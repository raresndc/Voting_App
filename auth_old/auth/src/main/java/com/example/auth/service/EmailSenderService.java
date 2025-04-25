package com.example.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailSenderService {

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

    public static String getUsernameFromEmail(String email) {
        String[] parts = email.split("@");
        return parts[0];
    }

    public String sendOtp(String toEmail, int otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        // Create a MimeMessageHelper with HTML content type
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");  // 'true' for HTML content

        helper.setTo(toEmail);
        String username = getUsernameFromEmail(toEmail);
        helper.setSubject("Your One-Time Password (OTP) for Account Creation");

        // HTML content for the email with explicit inline styles
        String htmlContent = "<html><body style='font-family: Arial, sans-serif; color: #000000; line-height: 1.5;'>" +
                "<p>Dear " + username + ",</p>" +
                "<p>Thank you for choosing to create an account with us!</p>" +
                "<p>To complete your registration, we have generated a one-time password (OTP) for you. Please use the following code within the next 10 minutes to verify your email address:</p>" +
                "<p style='font-size: 22px; color: #000000; font-weight: bold;'>Your OTP: <span style='color: #000000;'>" + otp + "</span></p>" +
                "<p>For your security, please do not share this code with anyone. If you did not request this OTP, please ignore this email.</p>" +
                "<p>If you have any questions or need assistance, feel free to contact our support team at <a href='mailto:support@company.com'>support@company.com</a>.</p>" +
                "<p>We appreciate your trust in us and look forward to having you as a part of our community.</p>" +
                "<p>Best regards,<br>The VoteMeUp Team<br><a href='https://www.company.com'>Company Website</a><br><a href='mailto:support@company.com'>support@company.com</a></p>" +
                "</body></html>";

        // Set the HTML content
        helper.setText(htmlContent, true);  // true indicates HTML content

        // Send the email
        mailSender.send(message);

        return "OTP sent via email to: " + toEmail;
    }

//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        String username = getUsernameFromEmail(toEmail);
//        message.setSubject("Your One-Time Password (OTP) for Account Creation");
//        message.setText("Dear " + username + "\n" +
//                "Thank you for choosing to create an account with us!\n" +
//                "\n" +
//                "To complete your registration, we have generated a one-time password (OTP) for you. Please use the following code within the next 10 minutes to verify your email address:\n" +
//                "\n" +
//                "Your OTP: " + otp + "\n" +
//                "\n" +
//                "For your security, please do not share this code with anyone. If you did not request this OTP, please ignore this email.\n" +
//                "\n" +
//                "If you have any questions or need assistance, feel free to contact our support team at [Support Email Address].\n" +
//                "\n" +
//                "We appreciate your trust in us and look forward to having you as a part of our community.\n" +
//                "\n" +
//                "Best regards,\n" +
//                "The VoteMeUp Team\n" +
//                "[Company Website URL]\n" +
//                "[Support Email Address]");
//
//        mailSender.send(message);
//        return "OTP sent via email to: " + toEmail;
//    }
}
