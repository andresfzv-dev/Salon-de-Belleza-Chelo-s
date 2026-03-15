package com.chelos.salon_api.application.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ServicioResponse {

    private UUID id;
    private String nombre;
    private BigDecimal precio;
    private Integer duracionMinMinutos;
    private Integer duracionMaxMinutos;
}