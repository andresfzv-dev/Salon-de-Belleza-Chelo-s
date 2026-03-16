package com.chelos.salon_api.application.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ErrorResponse {

    private int status;
    private String mensaje;
    private LocalDateTime timestamp;
    private Map<String, String> errores;
}