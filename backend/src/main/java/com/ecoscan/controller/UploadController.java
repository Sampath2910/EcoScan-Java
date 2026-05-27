package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.service.UploadService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    // POST /api/upload
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadFile(
            @RequestParam("wasteImage") MultipartFile file,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated."));
        }

        try {
            Map<String, Object> result = uploadService.processUpload(file, userId);
            return ResponseEntity.ok(ApiResponse.ok("Classification successful.", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Upload failed: " + e.getMessage()));
        }
    }
}
