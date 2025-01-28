package com.koushik.redditclone.controller;

import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.redditclone.model.ImageData;
import com.koushik.redditclone.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final FileStorageService fileStorageService;

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        Optional<Resource> resourceOptional = fileStorageService.getFile(fileName);
        if (resourceOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<ImageData> imageDataOptional = fileStorageService.getImageData(fileName);
        if (imageDataOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(imageDataOptional.get().getType()))
                .body(resourceOptional.get());
    }
}
