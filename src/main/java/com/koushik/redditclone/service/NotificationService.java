package com.koushik.redditclone.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.redditclone.model.Notification;
import com.koushik.redditclone.model.Post;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Transactional
    public void notifyLike(User recipient, User sender, Post post) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .content(String.format("%s liked your post", sender.getUsername()))
                .type("LIKE")
                .post(post)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyComment(User recipient, User sender, Post post) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .content(String.format("%s commented on your post", sender.getUsername()))
                .type("COMMENT")
                .post(post)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyShare(User recipient, User sender, Post post) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .content(String.format("%s shared your post", sender.getUsername()))
                .type("SHARE")
                .post(post)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyNewFollower(User recipient, User sender) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .content(String.format("%s started following you", sender.getUsername()))
                .type("FOLLOW")
                .build();
        notificationRepository.save(notification);
    }
}
