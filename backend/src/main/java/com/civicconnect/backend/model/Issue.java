package com.civicconnect.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User reporter;

    @Column(nullable = false)
    private String title;

    private String category;
    
    private String shortDescription;
    
    @Column(columnDefinition = "TEXT")
    private String detailedDescription;

    @ElementCollection
    @CollectionTable(name = "issue_images", joinColumns = @JoinColumn(name = "issue_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    private Double latitude;
    private Double longitude;

    private String district;
    private String city;
    private String locality;

    @Enumerated(EnumType.STRING)
    private IssueSeverity severity;

    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.REPORTED;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private Integer supportsCount = 0;
    private Integer commentsCount = 0;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getDetailedDescription() { return detailedDescription; }
    public void setDetailedDescription(String detailedDescription) { this.detailedDescription = detailedDescription; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }
    public IssueSeverity getSeverity() { return severity; }
    public void setSeverity(IssueSeverity severity) { this.severity = severity; }
    public IssueStatus getStatus() { return status; }
    public void setStatus(IssueStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Integer getSupportsCount() { return supportsCount; }
    public void setSupportsCount(Integer supportsCount) { this.supportsCount = supportsCount; }
    public Integer getCommentsCount() { return commentsCount; }
    public void setCommentsCount(Integer commentsCount) { this.commentsCount = commentsCount; }
}
