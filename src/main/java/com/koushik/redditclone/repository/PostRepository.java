package com.koushik.redditclone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.koushik.redditclone.model.Post;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByTimestampDesc(Long userId);
    List<Post> findAllByOrderByTimestampDesc();
}
