package com.civicconnect.backend.security;
import com.civicconnect.backend.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;
public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private String status;
    public UserDetailsImpl(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities, String status) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.status = status;
    }
    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
        return new UserDetailsImpl(user.getId(), user.getEmail(), user.getPassword(), authorities, user.getStatus());
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return !("SUSPENDED".equals(status)); }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return !("SUSPENDED".equals(status)); }
}
