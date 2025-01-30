package com.koushik.redditclone.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.redditclone.dto.UserResponse;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<Void> followUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long userId) {
        userService.followUser(currentUser, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/unfollow")
    public ResponseEntity<Void> unfollowUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long userId) {
        userService.unfollowUser(currentUser, userId);
        return ResponseEntity.ok().build();
    }
}
