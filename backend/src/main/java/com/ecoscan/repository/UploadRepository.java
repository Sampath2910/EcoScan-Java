package com.ecoscan.repository;

import com.ecoscan.model.Upload;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UploadRepository extends JpaRepository<Upload, Long> {
    List<Upload> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Upload> findAllByOrderByCreatedAtDesc();
}
