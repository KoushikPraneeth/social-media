package com.koushik.redditclone.service;

import com.koushik.redditclone.model.Notification;
import com.koushik.redditclone.model.Notification.NotificationType;
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
}
