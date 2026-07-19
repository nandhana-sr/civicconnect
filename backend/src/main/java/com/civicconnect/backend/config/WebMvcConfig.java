package com.civicconnect.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    // Resource handling is now explicitly managed by FileController.java
    // to bypass all OS-specific file:/// path resolution issues.
}
