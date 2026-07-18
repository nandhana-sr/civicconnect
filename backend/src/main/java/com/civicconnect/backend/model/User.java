package com.civicconnect.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String email;

    private String mobileNumber;

    @Column(nullable = false)
    private String password;

    private String district;
    private String city;
    private String locality;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String profilePictureUrl;
    private String bio;

    private Integer totalCredits = 0;
    private Integer communityCredits = 0;
    private Integer trustScore = 0;
    private Integer impactScore = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Integer getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Integer totalCredits) { this.totalCredits = totalCredits; }
    public Integer getCommunityCredits() { return communityCredits; }
    public void setCommunityCredits(Integer communityCredits) { this.communityCredits = communityCredits; }
    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
    public Integer getImpactScore() { return impactScore; }
    public void setImpactScore(Integer impactScore) { this.impactScore = impactScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    private String status = "ACTIVE"; // ACTIVE, SUSPENDED
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
