package com.civicconnect.backend.repository;
import com.civicconnect.backend.model.Comment;
import com.civicconnect.backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByIssue(Issue issue);
}
