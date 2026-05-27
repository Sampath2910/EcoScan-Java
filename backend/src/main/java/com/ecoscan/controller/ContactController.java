package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.model.Contact;
import com.ecoscan.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactRepository contactRepository;

    @PostMapping
    public ResponseEntity<ApiResponse> submitContact(@RequestBody Map<String, String> body) {
        Contact c = new Contact();
        c.setName(body.getOrDefault("name", ""));
        c.setEmail(body.getOrDefault("email", ""));
        c.setMessage(body.getOrDefault("message", ""));
        contactRepository.save(c);
        return ResponseEntity.ok(ApiResponse.ok("Message received. Thank you!"));
    }
}
