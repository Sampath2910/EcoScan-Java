package com.ecoscan.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "recycled_products")
public class RecycledProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String image;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(name = "waste_used", nullable = false, length = 100)
    private String wasteUsed;

    @Column(nullable = false, length = 200)
    private String products;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
