package com.civicconnect.backend.controller;

import com.civicconnect.backend.model.Notification;
import com.civicconnect.backend.model.User;
import com.civicconnect.backend.repository.NotificationRepository;
import com.civicconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(userOpt.get());
            return ResponseEntity.ok(notifications);
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        
        if (notifOpt.isPresent()) {
            Notification notif = notifOpt.get();
            if(notif.getUser().getEmail().equals(email)) {
                notif.setRead(true);
                notificationRepository.save(notif);
                return ResponseEntity.ok("Marked as read");
            }
            return ResponseEntity.status(403).body("Unauthorized");
        }
        return ResponseEntity.notFound().build();
    }
}
