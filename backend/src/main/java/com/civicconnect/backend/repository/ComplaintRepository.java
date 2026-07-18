package com.civicconnect.backend.repository;
import com.civicconnect.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}
