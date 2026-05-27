package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.model.RecyclerReview;
import com.ecoscan.repository.RecyclerReviewRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final RecyclerReviewRepository reviewRepository;

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ApiResponse> addReview(
            @RequestBody Map<String, Object> body, HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated."));
        }

        Object recyclerNameObj = body.get("recyclerName");
        Object ratingObj = body.get("rating");

        if (recyclerNameObj == null || recyclerNameObj.toString().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("recyclerName is required."));
        }
        if (ratingObj == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("rating is required."));
        }

        int rating;
        try {
            rating = Integer.parseInt(ratingObj.toString());
            if (rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(ApiResponse.error("rating must be between 1 and 5."));
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("rating must be a valid number."));
        }

        RecyclerReview review = new RecyclerReview();
        review.setRecyclerName(recyclerNameObj.toString());
        review.setUserId(userId);
        review.setRating(rating);
        review.setReview(body.getOrDefault("review", "").toString());

        reviewRepository.save(review);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted."));
    }

    // GET /api/reviews/{recyclerName}
    @GetMapping("/{recyclerName}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getReviews(@PathVariable String recyclerName) {
        List<RecyclerReview> reviews = reviewRepository.findByRecyclerName(recyclerName);

        double avg = reviews.stream()
                .mapToInt(RecyclerReview::getRating)
                .average()
                .orElse(0.0);

        List<Map<String, Object>> reviewData = reviews.stream().map(r -> Map.<String, Object>of(
                "username",  r.getUser() != null ? r.getUser().getUsername() : "Unknown",
                "rating",    r.getRating(),
                "review",    r.getReview() != null ? r.getReview() : "",
                "createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : ""
        )).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok("Reviews fetched.", Map.of(
                "averageRating", Math.round(avg * 10.0) / 10.0,
                "reviews",       reviewData
        )));
    }
}
