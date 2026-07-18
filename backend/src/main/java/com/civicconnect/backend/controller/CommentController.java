package com.civicconnect.backend.controller;
import com.civicconnect.backend.model.Comment;
import com.civicconnect.backend.model.Issue;
import com.civicconnect.backend.model.User;
import com.civicconnect.backend.repository.CommentRepository;
import com.civicconnect.backend.repository.IssueRepository;
import com.civicconnect.backend.repository.UserRepository;
import com.civicconnect.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired CommentRepository commentRepository;
    @Autowired IssueRepository issueRepository;
    @Autowired UserRepository userRepository;
    @GetMapping("/issue/{issueId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long issueId) {
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        return ResponseEntity.ok(commentRepository.findByIssue(issue));
    }
    @PostMapping("/issue/{issueId}")
    public ResponseEntity<?> addComment(@PathVariable Long issueId, @RequestBody String content) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setIssue(issue);
        comment.setContent(content);
        commentRepository.save(comment);
        
        issue.setCommentsCount(issue.getCommentsCount() + 1);
        issueRepository.save(issue);
        
        return ResponseEntity.ok(comment);
    }
}
