package com.civicconnect.backend.repository;
import com.civicconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByCityIgnoreCase(String city);
    List<User> findByLocalityIgnoreCase(String locality);
}
