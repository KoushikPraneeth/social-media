package com.koushik.redditclone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.koushik.redditclone.model.Post;
import java.time.LocalDateTime;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.user WHERE p.user.id = :userId")
    Page<Post> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.user")
    Page<Post> findAllWithUser(Pageable pageable);

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.user WHERE p.timestamp > :timestamp")
    Page<Post> findByTimestampAfter(LocalDateTime timestamp, Pageable pageable);
}
