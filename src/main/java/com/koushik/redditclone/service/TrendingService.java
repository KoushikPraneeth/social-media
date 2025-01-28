package com.koushik.redditclone.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.redditclone.model.Post;
import com.koushik.redditclone.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class TrendingService {
    
    private final PostRepository postRepository;
    private final Map<String, Double> trendingHashtags = new ConcurrentHashMap<>();
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional(readOnly = true)
    public void calculateTrends() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minus(24, ChronoUnit.HOURS);
        PageRequest pageRequest = PageRequest.of(0, 100, Sort.by("timestamp").descending());
        Page<Post> postPage;
        Map<String, Double> hashtagScores = new HashMap<>();
        
        do {
            postPage = postRepository.findByTimestampAfter(twentyFourHoursAgo, pageRequest);
            for (Post post : postPage.getContent()) {
                // Calculate time-based weight (1.0 for newest posts, decreasing to 0.0 for 24h old posts)
                double hoursAgo = ChronoUnit.HOURS.between(post.getTimestamp(), LocalDateTime.now());
                double timeWeight = Math.max(0.0, 1.0 - (hoursAgo / 24.0));
                
                for (String hashtag : post.getHashtags()) {
                    hashtagScores.merge(hashtag, timeWeight, Double::sum);
                }
            }
            pageRequest = pageRequest.next();
        } while (postPage.hasNext());

        // Sort hashtags by score and keep top 10
        List<Map.Entry<String, Double>> sortedHashtags = new ArrayList<>(hashtagScores.entrySet());
        sortedHashtags.sort(Map.Entry.<String, Double>comparingByValue().reversed());
        
        // Update trending hashtags
        trendingHashtags.clear();
        sortedHashtags.stream()
            .limit(10)
            .forEach(entry -> trendingHashtags.put(entry.getKey(), entry.getValue()));
    }
    
    public List<String> getTrendingHashtags() {
        return new ArrayList<>(trendingHashtags.keySet());
    }
}
