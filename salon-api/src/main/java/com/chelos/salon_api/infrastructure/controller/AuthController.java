package com.chelos.salon_api.infrastructure.controller;

import com.chelos.salon_api.application.dto.request.LoginRequest;
import com.chelos.salon_api.application.dto.response.LoginResponse;
import com.chelos.salon_api.application.service.AuthService;
import com.chelos.salon_api.infrastructure.email.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {
        emailService.enviarRecordatorio(
                "your email",
                "María López",
                " Corte de cabello",
                " 20 de marzo de 2026",
                " 10:00"
        );
        return ResponseEntity.ok("Email enviado");
    }
}