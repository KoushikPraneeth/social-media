package com.koushik.redditclone.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String content;
    private String imageUrl;  // URL to access the image
    private LocalDateTime timestamp;
    private UserSummary user;
    private int likesCount;
    private int commentsCount;
    private int shareCount;
    private boolean isLiked;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String username;
        private String profileUrl; // New field for the profile URL
    }
}
