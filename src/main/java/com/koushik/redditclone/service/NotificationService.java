package com.koushik.redditclone.service;

import com.koushik.redditclone.model.Notification;
import com.koushik.redditclone.model.Notification.NotificationType;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.model.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Long userId, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .type(type)
                .message(message)
                .userId(userId)
                .build();

        // Send to user-specific topic channel
        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    public void notifyNewFollower(Long followedUserId, String followerUsername) {
        String message = followerUsername + " started following you";
        sendNotification(followedUserId, message, NotificationType.NEW_FOLLOWER);
    }

    public void notifyNewPost(Long followerId, String posterUsername) {
        String message = posterUsername + " created a new post";
        sendNotification(followerId, message, NotificationType.NEW_POST);
    }

    public void notifyComment(User postOwner, User commenter, Post post) {
        String message = commenter.getUsername() + " commented on your post";
        sendNotification(postOwner.getId(), message, NotificationType.COMMENT);
    }

    public void notifyLike(User postOwner, User liker, Post post) {
        String message = liker.getUsername() + " liked your post";
        sendNotification(postOwner.getId(), message, NotificationType.LIKE);
    }

    public void notifyShare(User postOwner, User sharer, Post post) {
        String message = sharer.getUsername() + " shared your post";
        sendNotification(postOwner.getId(), message, NotificationType.SHARE);
    }
}
