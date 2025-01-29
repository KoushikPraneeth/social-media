package com.koushik.redditclone.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.redditclone.model.User;
import com.koushik.redditclone.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    @Transactional
    public User createUser(String username, String email, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles("USER")
                .build();

        return userRepository.save(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public void followUser(User currentUser, Long userIdToFollow) {
        if (currentUser.getId().equals(userIdToFollow)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        User userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        currentUser.getFollowing().add(userToFollow);
        userRepository.save(currentUser);
        notificationService.notifyNewFollower(userToFollow, currentUser);
    }

    @Transactional
    public void unfollowUser(User currentUser, Long userIdToUnfollow) {
        if (currentUser.getId().equals(userIdToUnfollow)) {
            throw new IllegalArgumentException("Cannot unfollow yourself");
        }

        User userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        currentUser.getFollowing().remove(userToUnfollow);
        userRepository.save(currentUser);
    }
}
