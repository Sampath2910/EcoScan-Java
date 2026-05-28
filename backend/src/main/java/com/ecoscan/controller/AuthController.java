package com.ecoscan.controller;

import com.ecoscan.dto.ApiResponse;
import com.ecoscan.dto.LoginRequest;
import com.ecoscan.dto.RegisterRequest;
import com.ecoscan.model.User;
import com.ecoscan.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import com.ecoscan.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // POST /api/auth/register/user
    @PostMapping("/register/user")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterRequest req) {
        req.setRole("user");
        try {
            userService.register(req);
            return ResponseEntity.ok(ApiResponse.ok("User registered successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /api/auth/register/reclaimer
    @PostMapping("/register/reclaimer")
    public ResponseEntity<ApiResponse> registerReclaimer(@RequestBody RegisterRequest req) {
        req.setRole("reclaimer");
        try {
            userService.register(req);
            return ResponseEntity.ok(ApiResponse.ok("Reclaimer registered successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest req, HttpSession session) {
        Optional<User> userOpt = userService.authenticate(req.getEmail(), req.getPassword());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            session.setAttribute("userId",   user.getId());
            session.setAttribute("email",    user.getEmail());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("userRole", user.getRole());

            String token = JwtUtil.generateToken(Map.of(
                    "userId",   user.getId(),
                    "email",    user.getEmail(),
                    "username", user.getUsername(),
                    "userRole", user.getRole()
            ));

            return ResponseEntity.ok(ApiResponse.ok("Login successful.", Map.of(
                    "userId",   user.getId(),
                    "username", user.getUsername(),
                    "email",    user.getEmail(),
                    "role",     user.getRole(),
                    "token",    token
            )));
        }
        return ResponseEntity.status(401).body(ApiResponse.error("Invalid email or password."));
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully."));
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated."));
        }
        return ResponseEntity.ok(ApiResponse.ok("Authenticated.", Map.of(
                "userId",   userId,
                "username", session.getAttribute("username"),
                "email",    session.getAttribute("email"),
                "role",     session.getAttribute("userRole")
        )));
    }
}
