package com.civicconnect.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    @Bean
    public CommandLineRunner dropConstraints(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println("Dropping outdated issues_status_check constraint...");
                jdbcTemplate.execute("ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check");
                jdbcTemplate.execute("ALTER TABLE issue_status_history DROP CONSTRAINT IF EXISTS issue_status_history_status_check");
                System.out.println("Successfully dropped constraints.");
            } catch (Exception e) {
                System.err.println("Failed to drop constraints: " + e.getMessage());
            }
        };
    }
}
