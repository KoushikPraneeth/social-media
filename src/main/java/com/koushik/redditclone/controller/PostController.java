package com.koushik.redditclone.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.koushik.redditclone.dto.CommentRequest;
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

    @GetMapping("/user/{username}")
    public ResponseEntity<PageResponse<PostResponse>> getUserPosts(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getUserPosts(username, page, size));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        postService.addComment(postId, request, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getComments(postId, page, size));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        try {
            postService.likePost(postId, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<?> unlikePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        try {
            postService.unlikePost(postId, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<?> sharePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        try {
            postService.sharePost(postId, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
