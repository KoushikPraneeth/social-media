package com.koushik.redditclone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.koushik.redditclone.model.Post;
import java.time.LocalDateTime;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserId(Long userId, Pageable pageable);
    Page<Post> findAll(Pageable pageable);
    Page<Post> findByTimestampAfter(LocalDateTime timestamp, Pageable pageable);
}
