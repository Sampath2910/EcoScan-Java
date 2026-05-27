package com.ecoscan.service;

import com.ecoscan.dto.RegisterRequest;
import com.ecoscan.model.User;
import com.ecoscan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : "user");

        if ("reclaimer".equals(user.getRole())) {
            user.setUsername(req.getCompanyName());
            user.setCompanyName(req.getCompanyName());
            user.setAddress(req.getAddress());
        } else {
            user.setUsername(req.getName());
            user.setPhone(req.getPhone());
            user.setAddress(req.getAddress());
            user.setVillage(req.getVillage());
            user.setPincode(req.getPincode());
        }

        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
