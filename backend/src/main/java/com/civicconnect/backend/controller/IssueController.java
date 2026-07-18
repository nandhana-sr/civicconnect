package com.civicconnect.backend.controller;
import com.civicconnect.backend.model.Issue;
import com.civicconnect.backend.model.IssueSeverity;
import com.civicconnect.backend.model.User;
import com.civicconnect.backend.repository.IssueRepository;
import com.civicconnect.backend.repository.UserRepository;
import com.civicconnect.backend.security.UserDetailsImpl;
import com.civicconnect.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import com.civicconnect.backend.model.Notification;
import com.civicconnect.backend.model.IssueStatus;
import com.civicconnect.backend.repository.NotificationRepository;

@RestController
@RequestMapping("/api/issues")
public class IssueController {
    @Autowired IssueRepository issueRepository;
    @Autowired UserRepository userRepository;
    @Autowired FileStorageService fileStorageService;
    @Autowired NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createIssue(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("shortDescription") String shortDescription,
            @RequestParam("detailedDescription") String detailedDescription,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam("district") String district,
            @RequestParam("city") String city,
            @RequestParam("locality") String locality,
            @RequestParam("severity") String severity,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Issue issue = new Issue();
        issue.setReporter(user);
        issue.setTitle(title);
        issue.setCategory(category);
        issue.setShortDescription(shortDescription);
        issue.setDetailedDescription(detailedDescription);
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);
        issue.setDistrict(district);
        issue.setCity(city);
        issue.setLocality(locality);
        issue.setSeverity(IssueSeverity.valueOf(severity.toUpperCase()));
        
        if (images != null && images.length > 0) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : images) {
                String fileName = fileStorageService.storeFile(file);
                imageUrls.add("/uploads/" + fileName);
            }
            issue.setImages(imageUrls);
        }
        issueRepository.save(issue);

        // Notify users in the same locality (case insensitive)
        List<User> areaUsers = userRepository.findByLocalityIgnoreCase(locality);
        for (User areaUser : areaUsers) {
            if (!areaUser.getId().equals(user.getId())) {
                Notification notif = new Notification();
                notif.setUser(areaUser);
                notif.setRelatedIssue(issue);
                notif.setType("NEW_ISSUE_IN_AREA");
                notif.setMessage("A new issue '" + issue.getTitle() + "' was reported in your locality (" + locality + ").");
                notificationRepository.save(notif);
            }
        }

        return ResponseEntity.ok(issue);
    }

    @Autowired com.civicconnect.backend.repository.IssueStatusHistoryRepository issueStatusHistoryRepository;

    @PutMapping("/{id}/status")
    public ResponseEntity<?> toggleIssueStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Issue issue = issueRepository.findById(id).orElseThrow();
        User adminUser = userRepository.findById(userDetails.getId()).orElseThrow();
        
        // Ensure only admin can toggle
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(403).body("Only administrators are authorized to update issue status.");
        }

        String newStatus = body.get("status");
        if (newStatus != null) {
            try {
                IssueStatus statusEnum = IssueStatus.valueOf(newStatus.toUpperCase());
                issue.setStatus(statusEnum);
                issueRepository.save(issue);
                
                // Record history
                com.civicconnect.backend.model.IssueStatusHistory history = new com.civicconnect.backend.model.IssueStatusHistory();
                history.setIssue(issue);
                history.setStatus(statusEnum);
                history.setChangedBy(adminUser);
                issueStatusHistoryRepository.save(history);
                
                // Notify the author
                Notification notif = new Notification();
                notif.setUser(issue.getReporter());
                notif.setRelatedIssue(issue);
                notif.setType("STATUS_UPDATE");
                notif.setMessage("Your issue '" + issue.getTitle() + "' status has been updated to " + statusEnum.name() + ".");
                notificationRepository.save(notif);
                
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status.");
            }
        }
        return ResponseEntity.ok(issue);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long id) {
        return issueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/history")
    public ResponseEntity<List<com.civicconnect.backend.model.IssueStatusHistory>> getIssueHistory(@PathVariable Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(issueStatusHistoryRepository.findByIssueOrderByChangedAtDesc(issue));
    }
    
    @Autowired com.civicconnect.backend.repository.ReportedPostRepository reportedPostRepository;
    
    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportIssue(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Issue issue = issueRepository.findById(id).orElseThrow();
        
        String reason = body.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Reason is required");
        }
        
        com.civicconnect.backend.model.ReportedPost report = new com.civicconnect.backend.model.ReportedPost();
        report.setIssue(issue);
        report.setReportedBy(user);
        report.setReason(reason);
        reportedPostRepository.save(report);
        
        return ResponseEntity.ok("Issue reported successfully");
    }
}
