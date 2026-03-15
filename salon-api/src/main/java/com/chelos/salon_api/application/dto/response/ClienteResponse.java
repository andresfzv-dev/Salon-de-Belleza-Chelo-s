package com.chelos.salon_api.application.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ClienteResponse {

    private UUID id;
    private String nombre;
    private String telefono;
    private String email;
}