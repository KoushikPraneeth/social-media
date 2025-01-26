package com.koushik.redditclone.service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.koushik.redditclone.model.ImageData;
import com.koushik.redditclone.repository.ImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    
    private final ImageRepository imageRepository;

    public String storeFile(MultipartFile file) throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "_" + originalFileName;

        ImageData imageData = ImageData.builder()
                .name(fileName)
                .type(file.getContentType())
                .data(file.getBytes())
                .build();

        imageRepository.save(imageData);
        return fileName;
    }

    public Optional<ImageData> getFile(String fileName) {
        return imageRepository.findByName(fileName);
    }
}
