package com.koushik.redditclone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.koushik.redditclone.model.Post;
import java.time.LocalDateTime;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query(value = "SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.user WHERE p.user.id = :userId ORDER BY p.timestamp DESC")
    Page<Post> findByUserId(Long userId, Pageable pageable);

    @Query(value = "SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.user ORDER BY p.timestamp DESC")
    Page<Post> findAllWithUser(Pageable pageable);

    @Query(value = "SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.user WHERE p.timestamp > :timestamp ORDER BY p.timestamp DESC")
    Page<Post> findByTimestampAfter(LocalDateTime timestamp, Pageable pageable);
}
