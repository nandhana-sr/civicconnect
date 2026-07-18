package com.civicconnect.backend.dto;
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    public JwtResponse(String accessToken, Long id, String email, String role) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.role = role;
    }
    public String getToken() { return token; }
    public String getType() { return type; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
