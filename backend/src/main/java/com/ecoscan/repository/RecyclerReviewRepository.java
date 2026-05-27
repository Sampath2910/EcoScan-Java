package com.ecoscan.repository;

import com.ecoscan.model.RecyclerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecyclerReviewRepository extends JpaRepository<RecyclerReview, Long> {
    List<RecyclerReview> findByRecyclerName(String recyclerName);
}
