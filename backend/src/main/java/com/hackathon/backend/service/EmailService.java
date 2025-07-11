package com.hackathon.backend.service;

import com.hackathon.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Value("${app.baseUrl}")
    private String baseUrl;

    @Value("${app.name}")
    private String appName;

    public void sendVerificationEmail(User user, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setFrom(from);
            helper.setSubject("Email Verification - " + appName);

            String verificationUrl = baseUrl + "/verify-email/" + token;
            String emailContent = createEmailContent(user, verificationUrl);

            helper.setText(emailContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String createEmailContent(User user, String verificationUrl) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                ".button { display: inline-block; background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }" +
                ".footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>Welcome to " + appName + "!</h1>" +
                "</div>" +
                "<div class=\"content\">" +
                "<h2>Hi " + user.getFirstName() + ",</h2>" +
                "<p>Thank you for registering with " + appName + "! To complete your registration, please verify your email address by clicking the button below:</p>" +
                "<div style=\"text-align: center;\">" +
                "<a href=\"" + verificationUrl + "\" class=\"button\">Verify Email Address</a>" +
                "</div>" +
                "<p>If the button doesn't work, you can copy and paste the following link into your browser:</p>" +
                "<p><a href=\"" + verificationUrl + "\">" + verificationUrl + "</a></p>" +
                "<p>This verification link will expire in 24 hours.</p>" +
                "<p>If you didn't create an account with " + appName + ", please ignore this email.</p>" +
                "<p>Best regards,<br>The " + appName + " Team</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p>© 2025 " + appName + ". All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

}
