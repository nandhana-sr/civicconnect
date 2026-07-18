package com.civicconnect.backend.controller;

import com.civicconnect.backend.model.*;
import com.civicconnect.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private IssueRepository issueRepository;
    @Autowired private ReportedPostRepository reportedPostRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private IssueStatusHistoryRepository issueStatusHistoryRepository;
    @Autowired private jakarta.persistence.EntityManager entityManager;
    @Autowired private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            jdbcTemplate.execute("ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check");
            jdbcTemplate.execute("ALTER TABLE issue_status_history DROP CONSTRAINT IF EXISTS issue_status_history_status_check");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalIssues", issueRepository.count());
        stats.put("reportedIssues", issueRepository.countByStatus(IssueStatus.REPORTED));
        stats.put("underReviewIssues", issueRepository.countByStatus(IssueStatus.UNDER_REVIEW));
        stats.put("resolvedIssues", issueRepository.countByStatus(IssueStatus.RESOLVED));
        stats.put("rejectedIssues", issueRepository.countByStatus(IssueStatus.REJECTED));
        stats.put("totalReports", reportedPostRepository.count());
        stats.put("mostReportedCategory", issueRepository.findMostReportedCategory());
        
        List<Object[]> categoryCounts = entityManager.createQuery("SELECT i.category, COUNT(i) FROM Issue i GROUP BY i.category", Object[].class).getResultList();
        List<Map<String, Object>> categoryData = new java.util.ArrayList<>();
        for (Object[] row : categoryCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("value", row[1]);
            categoryData.add(map);
        }
        stats.put("categoryData", categoryData);

        List<Object[]> statusCounts = entityManager.createQuery("SELECT i.status, COUNT(i) FROM Issue i GROUP BY i.status", Object[].class).getResultList();
        List<Map<String, Object>> statusData = new java.util.ArrayList<>();
        for (Object[] row : statusCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0] != null ? row[0].toString() : "UNKNOWN");
            map.put("count", row[1]);
            statusData.add(map);
        }
        stats.put("statusData", statusData);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow();
        String newStatus = body.get("status"); // ACTIVE, SUSPENDED
        if (newStatus != null && (newStatus.equals("ACTIVE") || newStatus.equals("SUSPENDED"))) {
            user.setStatus(newStatus);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("Invalid status");
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportedPost>> getAllReportedPosts() {
        return ResponseEntity.ok(reportedPostRepository.findAll());
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<?> ignoreReport(@PathVariable Long id) {
        reportedPostRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcastNotification(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message is required");
        }
        
        List<User> allUsers = userRepository.findAll();
        for (User u : allUsers) {
            Notification notif = new Notification();
            notif.setUser(u);
            notif.setType("ADMIN_BROADCAST");
            notif.setMessage(message);
            notificationRepository.save(notif);
        }
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/issues/{id}/status")
    public ResponseEntity<?> updateIssueStatus(
            @PathVariable Long id, 
            @RequestParam(required=false) String status, 
            @RequestBody(required=false) Map<String, String> body) {
            
        Issue issue = issueRepository.findById(id).orElseThrow();
        
        // Handle both RequestParam and RequestBody
        String newStatus = status;
        if (newStatus == null && body != null && body.containsKey("status")) {
            newStatus = body.get("status");
        }
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }
        
        try {
            IssueStatus statusEnum = IssueStatus.valueOf(newStatus.toUpperCase());
            issue.setStatus(statusEnum);
            issueRepository.save(issue);
            
            // Get Admin User
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User adminUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            
            // Record history
            IssueStatusHistory history = new IssueStatusHistory();
            history.setIssue(issue);
            history.setStatus(statusEnum);
            history.setChangedBy(adminUser);
            issueStatusHistoryRepository.save(history);
            
            // Notification
            Notification notif = new Notification();
            notif.setUser(issue.getReporter());
            notif.setRelatedIssue(issue);
            notif.setType("ISSUE_UPDATED");
            notif.setMessage("Your issue '" + issue.getTitle() + "' has been updated to " + statusEnum.name());
            notificationRepository.save(notif);
            
            // Scoring System update
            if (statusEnum == IssueStatus.RESOLVED) {
                User author = issue.getReporter();
                author.setImpactScore(author.getImpactScore() + 10);
                author.setTotalCredits(author.getTotalCredits() + 50);
                userRepository.save(author);
            }
            
            return ResponseEntity.ok(issue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @DeleteMapping("/issues/{id}")
    public ResponseEntity<?> deleteIssue(@PathVariable Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow();
        
        // Delete related entities using EntityManager to avoid foreign key constraints
        entityManager.createQuery("DELETE FROM Comment c WHERE c.issue = :issue")
            .setParameter("issue", issue).executeUpdate();
            
        entityManager.createQuery("DELETE FROM Support s WHERE s.issue = :issue")
            .setParameter("issue", issue).executeUpdate();
            
        entityManager.createQuery("DELETE FROM ReportedPost r WHERE r.issue = :issue")
            .setParameter("issue", issue).executeUpdate();
            
        entityManager.createQuery("DELETE FROM IssueStatusHistory h WHERE h.issue = :issue")
            .setParameter("issue", issue).executeUpdate();
            
        entityManager.createQuery("DELETE FROM Notification n WHERE n.relatedIssue = :issue")
            .setParameter("issue", issue).executeUpdate();
            
        issueRepository.delete(issue);
        
        return ResponseEntity.ok().build();
    }
}
