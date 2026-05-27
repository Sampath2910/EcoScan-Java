package com.ecoscan.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Value("${ecoscan.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Serve uploaded images from the filesystem via /api/files/**
     * e.g. /api/files/temp/20240516_123456_waste.jpg
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get(uploadDir).toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/api/files/**")
                .addResourceLocations(absolutePath);
    }
}
