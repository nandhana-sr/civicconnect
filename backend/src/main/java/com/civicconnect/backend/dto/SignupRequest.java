package com.civicconnect.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class SignupRequest {
    @NotBlank private String fullName;
    @NotBlank @Email private String email;
    @NotBlank private String mobileNumber;
    @NotBlank private String password;
    private String district;
    private String city;
    private String locality;
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
}
