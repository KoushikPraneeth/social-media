package com.koushik.redditclone.controller;

import java.util.Optional;

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
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        Optional<ImageData> imageDataOptional = fileStorageService.getFile(fileName);
        
        if (imageDataOptional.isPresent()) {
            ImageData imageData = imageDataOptional.get();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(imageData.getType()))
                    .body(imageData.getData());
        }
        
        return ResponseEntity.notFound().build();
    }
}
