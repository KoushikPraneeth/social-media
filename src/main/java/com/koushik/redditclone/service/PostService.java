package com.koushik.redditclone.service;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.koushik.redditclone.dto.CreatePostRequest;
import com.koushik.redditclone.dto.PageResponse;
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
    private final NotificationService notificationService;

    @Transactional
    public PostResponse createPost(CreatePostRequest request, User currentUser) throws IOException {
        List<String> hashtags = extractHashtags(request.getContent());

        Post post = Post.builder()
                .content(request.getContent())
                .hashtags(hashtags)
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

    private List<String> extractHashtags(String content) {
        Pattern pattern = Pattern.compile("#\\w+");
        Matcher matcher = pattern.matcher(content);
        return matcher.results()
                .map(matchResult -> matchResult.group())
                .collect(Collectors.toList());
    }

    public PageResponse<PostResponse> getAllPosts(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<Post> postPage = postRepository.findAll(pageRequest);
        
        List<PostResponse> posts = postPage.getContent().stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());

        return PageResponse.<PostResponse>builder()
                .data(posts)
                .total(postPage.getTotalElements())
                .page(page)
                .limit(size)
                .hasMore(postPage.hasNext())
                .build();
    }

    public PageResponse<PostResponse> getUserPosts(Long userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<Post> postPage = postRepository.findByUserId(userId, pageRequest);
        
        List<PostResponse> posts = postPage.getContent().stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());

        return PageResponse.<PostResponse>builder()
                .data(posts)
                .total(postPage.getTotalElements())
                .page(page)
                .limit(size)
                .hasMore(postPage.hasNext())
                .build();
    }

    private PostResponse mapToPostResponse(Post post) {
        String imageUrl = null;
        if (post.getImage() != null) {
            imageUrl = "/api/images/" + post.getImage().getName();
        }

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(imageUrl)
                .timestamp(post.getTimestamp())
                .user(PostResponse.UserSummary.builder()
                        .id(post.getUser().getId())
                        .username(post.getUser().getUsername())
                        .build())
                .likesCount(post.getLikes().size())
                .commentsCount(post.getCommentsCount())
                .shareCount(post.getShareCount())
                .isLiked(post.getLikes().contains(currentUser))
                .build();
    }
}
