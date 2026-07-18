package com.civicconnect.backend.repository;
import com.civicconnect.backend.model.Support;
import com.civicconnect.backend.model.Issue;
import com.civicconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportRepository extends JpaRepository<Support, Long> {
    Optional<Support> findByIssueAndUser(Issue issue, User user);
}
