package com.chelos.salon_api.application.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServicioRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a cero")
    private BigDecimal precio;

    @NotNull(message = "La duración mínima es obligatoria")
    @Min(value = 1, message = "La duración mínima debe ser al menos 1 minuto")
    private Integer duracionMinMinutos;

    @NotNull(message = "La duración máxima es obligatoria")
    @Min(value = 1, message = "La duración máxima debe ser al menos 1 minuto")
    private Integer duracionMaxMinutos;
}