package com.koushik.redditclone.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    private NotificationType type;
    private String message;
    private Long userId; // ID of the user who should receive the notification

    public enum NotificationType {
        NEW_FOLLOWER,
        NEW_POST
    }
}
