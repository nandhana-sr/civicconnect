package com.civicconnect.backend.repository;

import com.civicconnect.backend.model.ReportedPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportedPostRepository extends JpaRepository<ReportedPost, Long> {
}
