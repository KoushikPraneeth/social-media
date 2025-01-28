package com.koushik.redditclone.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.redditclone.dto.CreatePostRequest;
import com.koushik.redditclone.dto.PageResponse;
import com.koushik.redditclone.dto.PostResponse;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> createPost(
            @ModelAttribute CreatePostRequest request,
            @AuthenticationPrincipal User currentUser) throws IOException {
        PostResponse post = postService.createPost(request, currentUser);
        return ResponseEntity.ok(post);
    }

    @GetMapping
    public ResponseEntity<PageResponse<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllPosts(page, size));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PageResponse<PostResponse>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getUserPosts(userId, page, size));
    }
}
