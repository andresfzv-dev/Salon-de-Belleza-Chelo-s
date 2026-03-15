package com.chelos.salon_api.application.dto.response;

import com.chelos.salon_api.domain.model.EstadoCita;
import com.chelos.salon_api.domain.model.OrigenCita;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class CitaResponse {

    private UUID id;
    private UUID clienteId;
    private String clienteNombre;
    private UUID servicioId;
    private String servicioNombre;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Integer duracionRealMinutos;
    private EstadoCita estado;
    private OrigenCita origen;
}