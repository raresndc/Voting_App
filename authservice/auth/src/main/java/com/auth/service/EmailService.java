package com.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

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

    public void sendAccountVerifiedEmail(String to, String fullName) {
        MimeMessage msg = javaMailSender.createMimeMessage();
        try {
            // true = multipart (for inline), UTF-8
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(email, "VotingApp Support");
            helper.setTo(to);
            helper.setSubject("VotingApp • Account Successfully Verified");

            // 1) plain-text fallback
            String textBody = String.format(
                    "Hello %s,\n\n" +
                            "Great news—your VotingApp account has been successfully verified!\n\n" +
                            "You can now log in and start participating in polls, tracking results, and more.\n\n" +
                            "If you have any questions, feel free to reply to this email or reach out to our support team.\n\n" +
                            "Welcome aboard!\n\n" +
                            "The VotingApp Team\n" +
                            "support@votingapp.com | +40 712 345 678\n" +
                            "https://www.votingapp.com",
                    fullName
            );

//            // 2) embed logo inline (from src/main/resources/email/images/logo.png)
//            helper.addInline(
//                    "logo",
//                    new ClassPathResource("static/images/logo.svg"),
//                    "image/svg+xml"
//            );

            // 3) HTML body
            String htmlBody = """
                <html>
                  <body style="font-family:Arial, sans-serif; line-height:1.5;">
                    <h2>Hello %s,</h2>
                    <p>🎉 <strong>Your account is now verified!</strong></p>
                    <p>You can now <a href="https://www.votingapp.com/login">log in</a> and start creating or voting in polls.</p>
                    <p>If you need any help, just reply to this email or contact our support team.</p>
                    <hr style="margin:30px 0;"/>
                    <p style="font-size:0.9em; color:#555;">
                      The VotingApp Team<br/>
                      <a href="mailto:support@votingapp.com">support@votingapp.com</a> | +40 712 345 678<br/>
                      <a href="https://www.votingapp.com">www.votingapp.com</a>
                    </p>
                  </body>
                </html>
                """.formatted(fullName);

            // set both parts
            helper.setText(textBody, htmlBody);

            javaMailSender.send(msg);
        } catch (MessagingException e) {
            // log or rethrow as appropriate
            throw new RuntimeException("Failed to send verified-account email", e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException, UnsupportedEncodingException {
        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
        helper.setFrom(email, "VotingApp Support");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);  // true = HTML

        javaMailSender.send(msg);
    }


//    public void sendVerificationEmail(String recipientEmail, String code) {
//        sendEmail(
//                recipientEmail,
//                "VotingApp Account Verification Code",
//                "Your verification code is: " + code
//        );
//    }

    public void sendVerificationEmail(String to, String fullName, String code) {
        String subject = "VotingApp • Verify Your Email Address";
        String htmlBody = """
            <html>
              <body style="font-family:Arial, sans-serif; line-height:1.4;">
                <h2>Hello %s,</h2>
                <p>Thank you for signing up for <strong>VotingApp</strong>!<br/>
                   Please verify your email by entering the code below within <strong>15 minutes</strong>:</p>
                <p style="font-size:1.5em; font-weight:bold; background:#f0f0f0; padding:10px; display:inline-block;">
                  %s
                </p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr/>
                <p style="font-size:0.9em; color:#666;">
                  VotingApp Team<br/>
                  <a href="mailto:support@votingapp.com">support@votingapp.com</a> | +40 712 345 678<br/>
                  <a href="https://www.votingapp.com">www.votingapp.com</a>
                </p>
              </body>
            </html>
            """.formatted(fullName, code);

        try {
            sendHtmlEmail(to, subject, htmlBody);
        } catch (MessagingException | UnsupportedEncodingException e) {
            // handle or log
        }
    }

    public void sendPasswordResetEmail(String to, String fullName, String resetLink) {
        try {
            MimeMessage msg = javaMailSender.createMimeMessage();
            // true = multipart (for inline), "UTF-8" charset
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(email, "VotingApp Support");
            helper.setTo(to);
            helper.setSubject("VotingApp • Reset Your Password");

            // 1) Plain-text fallback
            String textBody = String.format(
                    "Hello %s,%n%n" +
                            "We received a request to reset your password. " +
                            "Click the link below within 30 minutes to set a new password:%n%n" +
                            "%s%n%n" +
                            "If you didn’t request this, you can safely ignore this email or reach out to our support team.%n%n" +
                            "— The VotingApp Team%n" +
                            "support@votingapp.com | +40 712 345 678%n" +
                            "https://www.votingapp.com",
                    fullName, resetLink
            );

            // 2) HTML body
            String htmlBody = """
          <html>
            <body style="font-family:Arial, sans-serif; line-height:1.5;">
              <h2>Hello %s,</h2>
              <p>We received a request to reset your password. Click the button below within <strong>30 minutes</strong>:</p>
              <p>
                <a href="%s"
                   style="background:#007bff; color:#ffffff; padding:10px 20px;
                          text-decoration:none; border-radius:5px; display:inline-block;">
                  Reset Password
                </a>
              </p>
              <p>If you didn’t request this, you can safely ignore this email or contact our support team.</p>
              <hr style="margin:30px 0;"/>
              <p style="font-size:0.9em; color:#555;">
                The VotingApp Team<br/>
                <a href="mailto:support@votingapp.com">support@votingapp.com</a> |
                +40 712 345 678<br/>
                <a href="https://www.votingapp.com">www.votingapp.com</a>
              </p>
            </body>
          </html>
          """.formatted(fullName, resetLink);

            helper.setText(textBody, htmlBody);
            javaMailSender.send(msg);

        } catch (MessagingException | UnsupportedEncodingException e) {
            // log or rethrow as appropriate
            throw new RuntimeException("Failed to send password-reset email", e);
        }
    }

}
