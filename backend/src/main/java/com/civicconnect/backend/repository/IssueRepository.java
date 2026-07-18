package com.civicconnect.backend.repository;
import com.civicconnect.backend.model.Issue;
import com.civicconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByReporter(User reporter);
    long countByStatus(com.civicconnect.backend.model.IssueStatus status);
    
    @org.springframework.data.jpa.repository.Query("SELECT i.category FROM Issue i GROUP BY i.category ORDER BY COUNT(i) DESC LIMIT 1")
    String findMostReportedCategory();
}
