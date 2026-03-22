package com.chelos.salon_api.application.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
public class DisponibilidadResponse {
    private List<LocalTime> horasDisponibles;
    private List<HoraOcupada> horasOcupadas;

    @Data
    @Builder
    public static class HoraOcupada {
        private LocalTime horaInicio;
        private LocalTime horaFin;
    }
}