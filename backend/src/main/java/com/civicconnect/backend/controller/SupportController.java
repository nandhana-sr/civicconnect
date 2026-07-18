package com.civicconnect.backend.controller;

import com.civicconnect.backend.model.Issue;
import com.civicconnect.backend.model.Support;
import com.civicconnect.backend.model.User;
import com.civicconnect.backend.repository.IssueRepository;
import com.civicconnect.backend.repository.SupportRepository;
import com.civicconnect.backend.repository.UserRepository;
import com.civicconnect.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired SupportRepository supportRepository;
    @Autowired IssueRepository issueRepository;
    @Autowired UserRepository userRepository;

    @PostMapping("/issue/{issueId}")
    public ResponseEntity<?> toggleSupport(@PathVariable Long issueId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Issue issue = issueRepository.findById(issueId).orElseThrow();

        Optional<Support> existingSupport = supportRepository.findByIssueAndUser(issue, user);
        
        if (existingSupport.isPresent()) {
            supportRepository.delete(existingSupport.get());
            issue.setSupportsCount(issue.getSupportsCount() - 1);
            issueRepository.save(issue);
            return ResponseEntity.ok("Support removed");
        } else {
            Support support = new Support();
            support.setIssue(issue);
            support.setUser(user);
            supportRepository.save(support);
            
            issue.setSupportsCount(issue.getSupportsCount() + 1);
            issueRepository.save(issue);
            return ResponseEntity.ok("Support added");
        }
    }
}
