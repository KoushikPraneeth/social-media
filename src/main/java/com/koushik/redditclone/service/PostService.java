package com.koushik.redditclone.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.koushik.redditclone.dto.CreatePostRequest;
import com.koushik.redditclone.dto.PostResponse;
import com.koushik.redditclone.model.ImageData;
import com.koushik.redditclone.model.Post;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;

    public PostResponse createPost(CreatePostRequest request, User currentUser) throws IOException {
        Post post = Post.builder()
                .content(request.getContent())
                .user(currentUser)
                .build();

        // Handle image if present
        MultipartFile imageFile = request.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(imageFile);
            ImageData image = fileStorageService.getFile(fileName)
                    .orElseThrow(() -> new RuntimeException("Failed to store image"));
            post.setImage(image);
        }

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    private PostResponse mapToPostResponse(Post post) {
        String imageUrl = null;
        if (post.getImage() != null) {
            imageUrl = "/api/images/" + post.getImage().getName();
        }

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(imageUrl)
                .timestamp(post.getTimestamp())
                .user(PostResponse.UserSummary.builder()
                        .id(post.getUser().getId())
                        .username(post.getUser().getUsername())
                        .build())
                .build();
    }
}
