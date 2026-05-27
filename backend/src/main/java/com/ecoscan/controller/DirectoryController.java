package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.service.RecyclerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/directory")
@RequiredArgsConstructor
public class DirectoryController {

    private final RecyclerService recyclerService;

    // GET /api/directory?type=Plastic&city=Hyderabad
    @GetMapping
    public ResponseEntity<ApiResponse> getDirectory(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String city) {

        List<Map<String, Object>> recyclers = recyclerService.getRecyclers(type, city);
        return ResponseEntity.ok(ApiResponse.ok("Recyclers fetched.", recyclers));
    }
}
