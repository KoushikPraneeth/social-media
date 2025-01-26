package com.koushik.redditclone.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.redditclone.service.TrendingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trends")
@RequiredArgsConstructor
public class TrendingController {
    
    private final TrendingService trendingService;
    
    @GetMapping
    public ResponseEntity<List<String>> getTrendingHashtags() {
        return ResponseEntity.ok(trendingService.getTrendingHashtags());
    }
}
