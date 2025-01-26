package com.koushik.redditclone.controller;

import com.koushik.redditclone.dto.AuthRequest;
import com.koushik.redditclone.dto.AuthResponse;
import com.koushik.redditclone.dto.RegisterRequest;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.repository.UserRepository;
import com.koushik.redditclone.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        logger.debug("Registration request received for username: {}", request.getUsername());
        
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            logger.debug("Username already exists: {}", request.getUsername());
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Username is already taken")
                            .build());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            logger.debug("Email already exists: {}", request.getEmail());
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Email is already registered")
                            .build());
        }

        try {
            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRoles("ROLE_USER");

            userRepository.save(user);
            logger.debug("User saved successfully: {}", user.getUsername());

            // Generate token
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtils.generateToken(userDetails);
            logger.debug("JWT token generated for user: {}", user.getUsername());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .message("User registered successfully")
                    .build());
        } catch (Exception e) {
            logger.error("Error during registration", e);
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Registration failed: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        logger.debug("Login request received for username: {}", request.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtils.generateToken(userDetails);
            logger.debug("JWT token generated for user: {}", request.getUsername());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .username(userDetails.getUsername())
                    .message("Login successful")
                    .build());
        } catch (Exception e) {
            logger.error("Error during login", e);
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Login failed: " + e.getMessage())
                            .build());
        }
    }
}
