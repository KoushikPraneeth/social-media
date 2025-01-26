package com.koushik.redditclone.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.koushik.redditclone.model.ImageData;

public interface ImageRepository extends JpaRepository<ImageData, Long> {
    Optional<ImageData> findByName(String name);
}
