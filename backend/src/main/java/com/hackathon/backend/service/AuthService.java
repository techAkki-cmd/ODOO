package com.hackathon.backend.service;

import com.hackathon.backend.dto.LoginRequest;
import com.hackathon.backend.dto.LoginResponse;
import com.hackathon.backend.dto.RegisterRequest;
import com.hackathon.backend.dto.ApiResponse;
import com.hackathon.backend.entity.EmailVerificationToken;
import com.hackathon.backend.entity.Role;
import com.hackathon.backend.entity.User;
import com.hackathon.backend.repository.EmailVerificationTokenRepository;
import com.hackathon.backend.repository.UserRepository;
import com.hackathon.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    public ApiResponse register(RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return new ApiResponse(false, "Email is already registered!");
            }

            // Create new user
            User user = new User(
                    request.getFirstName(),
                    request.getLastName(),
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword())
            );

            user.getRoles().add(Role.USER);
            User savedUser = userRepository.save(user);

            // Generate verification token
            String token = UUID.randomUUID().toString();
            EmailVerificationToken verificationToken = new EmailVerificationToken(token, savedUser);
            tokenRepository.save(verificationToken);

            // Send verification email
            emailService.sendVerificationEmail(savedUser, token);

            return new ApiResponse(true, "User registered successfully. Please check your email for verification.");
        } catch (Exception e) {
            return new ApiResponse(false, "Registration failed: " + e.getMessage());
        }
    }

    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.getEmailVerified()) {
                throw new RuntimeException("Please verify your email before logging in");
            }

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("email", user.getEmail());
            userInfo.put("roles", user.getRoles());

            return new LoginResponse(true, "Login successful", jwt, userInfo);
        } catch (Exception e) {
            return new LoginResponse(false, "Login failed: " + e.getMessage(), null, null);
        }
    }
    public ApiResponse verifyEmail(String token) {
        try {
            Optional<EmailVerificationToken> verificationToken = tokenRepository.findByToken(token);

            if (verificationToken.isEmpty()) {
                // Check if there's a user who might already be verified with this email
                // This is a more user-friendly approach
                return new ApiResponse(false, "This verification link has already been used or has expired. If your email is not verified, please register again.");
            }

            EmailVerificationToken emailToken = verificationToken.get();

            if (emailToken.isExpired()) {
                tokenRepository.delete(emailToken);
                return new ApiResponse(false, "Verification link has expired. Please register again.");
            }

            User user = emailToken.getUser();

            // Check if user is already verified
            if (user.getEmailVerified()) {
                tokenRepository.delete(emailToken); // Clean up token
                return new ApiResponse(true, "Your email is already verified! You can log in now.");
            }

            user.setEmailVerified(true);
            userRepository.save(user);
            tokenRepository.delete(emailToken);

            return new ApiResponse(true, "Email verified successfully! You can now log in.");
        } catch (Exception e) {
            return new ApiResponse(false, "Email verification failed: " + e.getMessage());
        }
    }

}
