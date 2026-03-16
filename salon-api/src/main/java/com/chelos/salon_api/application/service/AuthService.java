package com.chelos.salon_api.application.service;

import com.chelos.salon_api.application.dto.request.LoginRequest;
import com.chelos.salon_api.application.dto.response.LoginResponse;
import com.chelos.salon_api.application.exception.BusinessException;
import com.chelos.salon_api.config.JwtService;
import com.chelos.salon_api.domain.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        var admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BusinessException("Credenciales incorrectas");
        }

        String token = jwtService.generarToken(admin.getEmail());

        return LoginResponse.builder()
                .token(token)
                .nombre(admin.getNombre())
                .email(admin.getEmail())
                .build();
    }
}