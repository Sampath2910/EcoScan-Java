package com.ecoscan.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String role = "user";

    // Regular user fields
    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String address;

    @Column(length = 100)
    private String village;

    @Column(length = 20)
    private String pincode;

    // Reclaimer-specific fields
    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "company_info", columnDefinition = "TEXT")
    private String companyInfo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Upload> uploads;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecyclerReview> reviews;
}
