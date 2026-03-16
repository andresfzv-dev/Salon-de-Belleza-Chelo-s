package com.chelos.salon_api.application.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String nombre;
    private String email;
}