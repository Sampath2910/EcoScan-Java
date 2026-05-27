package com.ecoscan.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "uploads")
public class Upload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "image_path", nullable = false, length = 300)
    private String imagePath;

    @Column(length = 100)
    private String label;

    @Column(name = "is_recyclable")
    private Boolean isRecyclable;

    @Column(columnDefinition = "TEXT")
    private String suggestions; // stored as JSON string

    @Column(name = "waste_type", length = 100)
    private String wasteType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 200)
    private String location;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Collection tracking
    @Column(name = "collected_by", length = 150)
    private String collectedBy;

    @Column(length = 50)
    private String status = "Pending";

    @Column(name = "company_info", columnDefinition = "TEXT")
    private String companyInfo;
}
