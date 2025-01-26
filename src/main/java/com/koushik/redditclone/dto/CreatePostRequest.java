package com.koushik.redditclone.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CreatePostRequest {
    private String content;
    private MultipartFile image;  // Optional image file
}
