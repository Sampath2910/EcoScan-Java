package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.model.Upload;
import com.ecoscan.model.User;
import com.ecoscan.repository.UploadRepository;
import com.ecoscan.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reclaimer")
@RequiredArgsConstructor
public class ReclaimerController {

    private final UploadRepository uploadRepository;
    private final UserRepository   userRepository;

    // GET /api/reclaimer/uploads — all uploads for reclaimers
    @GetMapping("/uploads")
    public ResponseEntity<ApiResponse> getAllUploads(HttpSession session) {
        if (!isReclaimer(session)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied."));
        }

        List<Upload> uploads = uploadRepository.findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> data = uploads.stream().map(u -> {
            String username = userRepository.findById(u.getUserId())
                    .map(User::getUsername).orElse("Unknown");
            return Map.<String, Object>of(
                    "id",          u.getId(),
                    "imageUrl",    "/api/files/" + u.getImagePath(),
                    "label",       u.getLabel() != null ? u.getLabel() : "Unknown",
                    "username",    username,
                    "createdAt",   u.getCreatedAt() != null ? u.getCreatedAt().toString() : "",
                    "description", u.getDescription() != null ? u.getDescription() : "",
                    "collectedBy", u.getCollectedBy() != null ? u.getCollectedBy() : "",
                    "status",      u.getStatus() != null ? u.getStatus() : "Pending",
                    "companyInfo", u.getCompanyInfo() != null ? u.getCompanyInfo() : ""
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok("Uploads fetched.", data));
    }

    // POST /api/reclaimer/collect/{id}
    @PostMapping("/collect/{id}")
    public ResponseEntity<ApiResponse> collectUpload(
            @PathVariable Long id, HttpSession session) {

        if (!isReclaimer(session)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied."));
        }

        Long reclaimerId = (Long) session.getAttribute("userId");
        Optional<User> recyclerOpt = userRepository.findById(reclaimerId);
        Optional<Upload> uploadOpt = uploadRepository.findById(id);

        if (uploadOpt.isEmpty()) return ResponseEntity.notFound().build();

        Upload upload   = uploadOpt.get();
        User   recycler = recyclerOpt.orElseThrow();

        upload.setCollectedBy(recycler.getCompanyName() != null
                ? recycler.getCompanyName() : recycler.getUsername());
        upload.setStatus("Collected");
        upload.setCompanyInfo(
                "Company: " + (recycler.getCompanyName() != null ? recycler.getCompanyName() : recycler.getUsername()) +
                "\nAddress: " + (recycler.getAddress() != null ? recycler.getAddress() : "Not provided") +
                "\nContact: " + recycler.getEmail()
        );
        uploadRepository.save(upload);

        return ResponseEntity.ok(ApiResponse.ok("Waste marked as collected.", Map.of(
                "collectedBy", upload.getCollectedBy(),
                "status",      upload.getStatus(),
                "companyInfo", upload.getCompanyInfo()
        )));
    }

    // GET /api/reclaimer/collection-info/{id}
    @GetMapping("/collection-info/{id}")
    public ResponseEntity<ApiResponse> getCollectionInfo(@PathVariable Long id) {
        return uploadRepository.findById(id)
                .map(u -> ResponseEntity.ok(ApiResponse.ok("Info fetched.", Map.of(
                        "collectedBy", u.getCollectedBy() != null ? u.getCollectedBy() : "",
                        "status",      u.getStatus() != null ? u.getStatus() : "Pending",
                        "companyInfo", u.getCompanyInfo() != null ? u.getCompanyInfo() : ""
                ))))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/reclaimer/save-description
    @PostMapping("/save-description")
    public ResponseEntity<ApiResponse> saveDescription(
            @RequestBody Map<String, Object> body, HttpSession session) {

        if (!isReclaimer(session)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied."));
        }

        Object uploadIdObj = body.get("uploadId");
        if (uploadIdObj == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("uploadId is required."));
        }

        Long uploadId   = Long.valueOf(uploadIdObj.toString());
        String desc     = body.getOrDefault("description", "").toString().strip();

        return uploadRepository.findById(uploadId).map(u -> {
            u.setDescription(desc);
            uploadRepository.save(u);
            return ResponseEntity.ok(ApiResponse.ok("Description saved."));
        }).orElse(ResponseEntity.notFound().build());
    }

    private boolean isReclaimer(HttpSession session) {
        return "reclaimer".equals(session.getAttribute("userRole"));
    }
}
