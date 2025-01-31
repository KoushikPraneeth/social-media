package com.koushik.redditclone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.koushik.redditclone.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable String username) {
        UserResponse profile = userService.getUserProfile(username);
        return ResponseEntity.ok(new ApiResponse<>(profile, true, null));
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<ApiResponse<UserResponse>> followUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String username) {
        User userToFollow = userService.getUserByUsername(username);
        userService.followUser(currentUser, userToFollow.getId());
        UserResponse profile = userService.getUserProfile(username);
        return ResponseEntity.ok(new ApiResponse<>(profile, true, null));
    }

    @PostMapping("/{username}/unfollow")
    public ResponseEntity<ApiResponse<UserResponse>> unfollowUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String username) {
        User userToUnfollow = userService.getUserByUsername(username);
        userService.unfollowUser(currentUser, userToUnfollow.getId());
        UserResponse profile = userService.getUserProfile(username);
        return ResponseEntity.ok(new ApiResponse<>(profile, true, null));
    }
}
