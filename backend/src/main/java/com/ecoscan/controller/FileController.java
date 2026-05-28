package com.ecoscan.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${ecoscan.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/**")
    public ResponseEntity<Resource> getFile(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // Extract the path suffix after "/api/files"
        int index = uri.indexOf("/api/files");
        if (index == -1) {
            return ResponseEntity.notFound().build();
        }
        
        String suffix = uri.substring(index + "/api/files".length());
        
        try {
            // URL decode the path to handle spaces or special characters
            String decodedSuffix = java.net.URLDecoder.decode(suffix, java.nio.charset.StandardCharsets.UTF_8);
            
            // Normalize path separator and strip leading slash
            String relativePath = decodedSuffix.startsWith("/") ? decodedSuffix.substring(1) : decodedSuffix;
            Path filePath = Paths.get(uploadDir).resolve(relativePath).normalize().toAbsolutePath();
            
            // Security check: ensure the file path is within the upload directory
            Path parentDir = Paths.get(uploadDir).normalize().toAbsolutePath();
            if (!filePath.startsWith(parentDir)) {
                return ResponseEntity.status(403).build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    // Fallback content types based on file extension
                    String filename = filePath.getFileName().toString().toLowerCase();
                    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                        contentType = "image/jpeg";
                    } else if (filename.endsWith(".png")) {
                        contentType = "image/png";
                    } else if (filename.endsWith(".gif")) {
                        contentType = "image/gif";
                    } else if (filename.endsWith(".webp")) {
                        contentType = "image/webp";
                    } else {
                        contentType = "application/octet-stream";
                    }
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
        } catch (IOException e) {
            // Fall through to 404
        }
        return ResponseEntity.notFound().build();
    }
}
