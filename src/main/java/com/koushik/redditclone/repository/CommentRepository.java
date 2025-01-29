package com.koushik.redditclone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.koushik.redditclone.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Find comments with basic loading, JPA will handle relationships
    Page<Comment> findByPostIdOrderByTimestampDesc(Long postId, Pageable pageable);
}
