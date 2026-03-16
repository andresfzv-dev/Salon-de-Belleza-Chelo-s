package com.chelos.salon_api.config;

import com.chelos.salon_api.domain.model.Admin;
import com.chelos.salon_api.domain.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.nombre}")
    private String adminNombre;

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (adminRepository.count() == 0) {
                Admin admin = Admin.builder()
                        .nombre(adminNombre)
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .build();

                log.info("Admin inicial creado: {}", adminEmail);
            } else {
                log.info("Admin ya existe, omitiendo inicialización");
            }
        };
    }
}