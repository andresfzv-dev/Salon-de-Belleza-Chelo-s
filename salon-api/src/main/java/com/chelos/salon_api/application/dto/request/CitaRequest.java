package com.chelos.salon_api.application.dto.request;

import com.chelos.salon_api.domain.model.OrigenCita;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CitaRequest {

    @NotNull(message = "El cliente es obligatorio")
    private UUID clienteId;

    @NotNull(message = "El servicio es obligatorio")
    private UUID servicioId;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La duración real es obligatoria")
    @Min(value = 1, message = "La duración debe ser al menos 1 minuto")
    private Integer duracionRealMinutos;

    @NotNull(message = "El origen es obligatorio")
    private OrigenCita origen;
}