package com.koushik.redditclone.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.koushik.redditclone.model.ImageData;
import com.koushik.redditclone.repository.ImageRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    
    private final ImageRepository imageRepository;

    @Value("${app.upload.directory}")
    private String uploadDirectory;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Path.of(uploadDirectory));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String storeFile(MultipartFile file) throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "_" + originalFileName;
        String filePath = uploadDirectory + File.separator + fileName;

        ImageData imageData = ImageData.builder()
                .name(fileName)
                .type(file.getContentType())
                .path(filePath)
                .build();

        Files.copy(file.getInputStream(), Path.of(filePath), StandardCopyOption.REPLACE_EXISTING);
        imageRepository.save(imageData);
        return fileName;
    }

    public Optional<ImageData> getImageData(String fileName) {
        return imageRepository.findByName(fileName);
    }

    public Optional<Resource> getFile(String fileName) {
        try {
            Optional<ImageData> imageData = getImageData(fileName);
            if (imageData.isEmpty()) {
                return Optional.empty();
            }
            
            Path filePath = Path.of(imageData.get().getPath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return Optional.of(resource);
            }
            return Optional.empty();
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading file", e);
        }
    }
}
