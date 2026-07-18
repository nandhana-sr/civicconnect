package com.civicconnect.backend.repository;

import com.civicconnect.backend.model.Issue;
import com.civicconnect.backend.model.IssueStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, Long> {
    List<IssueStatusHistory> findByIssueOrderByChangedAtDesc(Issue issue);
}
