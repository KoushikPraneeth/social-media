package com.koushik.redditclone.service;

import com.koushik.redditclone.dto.CommentRequest;
import com.koushik.redditclone.dto.CreatePostRequest;
import com.koushik.redditclone.dto.PageResponse;
import com.koushik.redditclone.dto.PostResponse;
import com.koushik.redditclone.model.ImageData;
import com.koushik.redditclone.model.Post;
import com.koushik.redditclone.model.User;
import com.koushik.redditclone.repository.PostRepository;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

  private final PostRepository postRepository;
  private final FileStorageService fileStorageService;
  private final NotificationService notificationService;

  @Transactional
  public PostResponse createPost(CreatePostRequest request, User currentUser) throws IOException {
    List<String> hashtags = extractHashtags(request.getContent());

    Post post =
        Post.builder().content(request.getContent()).hashtags(hashtags).user(currentUser).build();

    // Handle image if present
    MultipartFile imageFile = request.getImage();
    if (imageFile != null && !imageFile.isEmpty()) {
      String fileName = fileStorageService.storeFile(imageFile);
      ImageData image =
          fileStorageService
              .getImageData(fileName)
              .orElseThrow(() -> new RuntimeException("Failed to store image"));
      post.setImage(image);
    }

    Post savedPost = postRepository.save(post);
    return mapToPostResponse(savedPost);
  }

  private List<String> extractHashtags(String content) {
    Pattern pattern = Pattern.compile("#\\w+");
    Matcher matcher = pattern.matcher(content);
    return matcher.results().map(matchResult -> matchResult.group()).collect(Collectors.toList());
  }

  public PageResponse<PostResponse> getAllPosts(int page, int size) {
    PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
    Page<Post> postPage = postRepository.findAll(pageRequest);

    List<PostResponse> posts =
        postPage.getContent().stream().map(this::mapToPostResponse).collect(Collectors.toList());

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

    List<PostResponse> posts =
        postPage.getContent().stream().map(this::mapToPostResponse).collect(Collectors.toList());

    return PageResponse.<PostResponse>builder()
        .data(posts)
        .total(postPage.getTotalElements())
        .page(page)
        .limit(size)
        .hasMore(postPage.hasNext())
        .build();
  }

  @Transactional
  public void addComment(Long postId, CommentRequest request, User currentUser) {
    try {
      Post post =
          postRepository
              .findById(postId)
              .orElseThrow(
                  () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

      post.setCommentsCount(post.getCommentsCount() + 1);
      Post savedPost = postRepository.save(post);

      // Temporarily comment out notifications
      /*
      if (!savedPost.getUser().equals(currentUser)) {
        notificationService.notifyComment(savedPost.getUser(), currentUser, savedPost);
      }
      */
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add comment");
    }
  }

  public PageResponse<?> getComments(Long postId, int page, int size) {
    // For now, return empty response since we don't store actual comments
    return PageResponse.builder()
        .data(List.of())
        .total(0L)
        .page(page)
        .limit(size)
        .hasMore(false)
        .build();
  }

  @Transactional
  public void likePost(Long postId, User currentUser) {
    try {
      Post post =
          postRepository
              .findById(postId)
              .orElseThrow(
                  () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

      post.getLikes().add(currentUser);
      Post savedPost = postRepository.save(post);

      // Temporarily comment out notifications
      /*
      if (!savedPost.getUser().equals(currentUser)) {
        notificationService.notifyLike(savedPost.getUser(), currentUser, savedPost);
      }
      */
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to like post");
    }
  }

  @Transactional
  public void unlikePost(Long postId, User currentUser) {
    try {
      Post post =
          postRepository
              .findById(postId)
              .orElseThrow(
                  () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

      post.getLikes().remove(currentUser);
      postRepository.save(post);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to unlike post");
    }
  }

  @Transactional
  public void sharePost(Long postId, User currentUser) {
    Post post =
        postRepository
            .findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

    post.setShareCount(post.getShareCount() + 1);
    Post savedPost = postRepository.save(post);

    // Temporarily comment out notifications
    /*
    if (!savedPost.getUser().equals(currentUser)) {
      notificationService.notifyShare(savedPost.getUser(), currentUser, savedPost);
    }
    */
  }

  private PostResponse mapToPostResponse(Post post) {
    String imageUrl = null;
    if (post.getImage() != null) {
      imageUrl = "/api/images/" + post.getImage().getName();
    }

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) {
      return PostResponse.builder()
          .id(post.getId())
          .content(post.getContent())
          .imageUrl(imageUrl)
          .timestamp(post.getTimestamp())
          .user(
              PostResponse.UserSummary.builder()
                  .id(post.getUser().getId())
                  .username(post.getUser().getUsername())
                  .build())
          .likesCount(post.getLikes().size())
          .commentsCount(post.getCommentsCount())
          .shareCount(post.getShareCount())
          .isLiked(false)
          .build();
    }
    User currentUser = (User) auth.getPrincipal();

    return PostResponse.builder()
        .id(post.getId())
        .content(post.getContent())
        .imageUrl(imageUrl)
        .timestamp(post.getTimestamp())
        .user(
            PostResponse.UserSummary.builder()
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
