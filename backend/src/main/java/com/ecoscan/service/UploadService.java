package com.ecoscan.service;

import com.ecoscan.dto.PredictionResult;
import com.ecoscan.model.Upload;
import com.ecoscan.repository.UploadRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final UploadRepository uploadRepository;
    private final ClassificationService classificationService;
    private final ObjectMapper objectMapper;

    @Value("${ecoscan.upload.dir:uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/gif", "image/webp");

    public Map<String, Object> processUpload(MultipartFile file, Long userId) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Allowed: JPEG, PNG, GIF, WEBP");
        }

        // Prepare storage path - use absolute path to avoid Tomcat temp directory issues
        Path dir = Paths.get(uploadDir, "temp").toAbsolutePath().normalize();
        Files.createDirectories(dir);

        String timestamp  = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "upload";
        }
        // Sanitize filename - remove path separators and special characters
        String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        String filename   = timestamp + "_" + safeFilename;
        Path   savedPath  = dir.resolve(filename);

        // Ensure parent directory exists (create if not exists)
        Files.createDirectories(savedPath.getParent());

        // Transfer file - use try-with-resources for safety
        file.transferTo(savedPath.toFile());

        // Run ML classification
        PredictionResult result = classificationService.classify(savedPath);

        // Persist to DB
        Upload upload = new Upload();
        upload.setUserId(userId);
        upload.setImagePath("temp/" + filename);
        upload.setLabel(result.getLabel());
        upload.setIsRecyclable(result.isRecyclable());
        upload.setSuggestions(toJson(result.getSuggestions()));
        upload.setDescription(result.getLabel() + " waste detected. " +
                (result.isRecyclable() ? "Recyclable." : "Non-recyclable."));
        upload.setStatus("Pending");
        uploadRepository.save(upload);

        // Build response map
        return Map.of(
                "uploadId",    upload.getId(),
                "imageUrl",    "/api/files/temp/" + filename,
                "label",       result.getLabel(),
                "isRecyclable", result.isRecyclable(),
                "confidence",  result.getConfidence(),
                "suggestions", result.getSuggestions(),
                "pointsEarned", result.isRecyclable() ? 100 : 0,
                "error",       result.getError() != null ? result.getError() : ""
        );
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
