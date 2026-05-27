package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.model.Upload;
import com.ecoscan.repository.UploadRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UploadRepository uploadRepository;
    private final ObjectMapper objectMapper;

    // GET /api/dashboard
    @GetMapping
    public ResponseEntity<ApiResponse> getDashboard(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated."));
        }

        List<Upload> uploads = uploadRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> uploadData = uploads.stream().map(u -> Map.<String, Object>of(
                "id",            u.getId(),
                "time",          u.getCreatedAt() != null ? u.getCreatedAt().toString() : "",
                "imageUrl",      "/api/files/" + u.getImagePath(),
                "materialLabel", u.getLabel() != null ? u.getLabel() : "Unknown",
                "isRecyclable",  Boolean.TRUE.equals(u.getIsRecyclable()),
                "suggestions",   parseSuggestions(u.getSuggestions()),
                "description",   u.getDescription() != null ? u.getDescription() : "",
                "location",      u.getLocation() != null ? u.getLocation() : "",
                "status",        u.getStatus() != null ? u.getStatus() : "Pending",
                "collectedBy",   u.getCollectedBy() != null ? u.getCollectedBy() : ""
        )).collect(Collectors.toList());

        long total       = uploads.size();
        long recyclable  = uploads.stream().filter(u -> Boolean.TRUE.equals(u.getIsRecyclable())).count();
        long trash       = total - recyclable;
        long rewards     = recyclable * 100;

        Map<String, Object> metrics = Map.of(
                "totalUploads",    total,
                "recyclableCount", recyclable,
                "trashCount",      trash,
                "rewardsEarned",   rewards
        );

        return ResponseEntity.ok(ApiResponse.ok("Dashboard data fetched.", Map.of(
                "metrics", metrics,
                "uploads", uploadData
        )));
    }

    private List<String> parseSuggestions(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
