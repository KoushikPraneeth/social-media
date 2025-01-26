package com.koushik.redditclone.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.redditclone.model.User;
import com.koushik.redditclone.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void followUser(User currentUser, Long userIdToFollow) {
        if (currentUser.getId().equals(userIdToFollow)) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        User userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new RuntimeException("User not found"));

        currentUser.getFollowing().add(userToFollow);
        userToFollow.getFollowers().add(currentUser);

        userRepository.save(currentUser);
        userRepository.save(userToFollow);

        // Send notification to followed user
        notificationService.notifyNewFollower(userToFollow.getId(), currentUser.getUsername());
    }

    @Transactional
    public void unfollowUser(User currentUser, Long userIdToUnfollow) {
        if (currentUser.getId().equals(userIdToUnfollow)) {
            throw new IllegalArgumentException("Users cannot unfollow themselves");
        }

        User userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new RuntimeException("User not found"));

        currentUser.getFollowing().remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(currentUser);

        userRepository.save(currentUser);
        userRepository.save(userToUnfollow);
    }
}
