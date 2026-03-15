package com.chelos.salon_api.application.dto.response;

import com.chelos.salon_api.domain.model.MetodoPago;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PagoResponse {

    private UUID id;
    private UUID citaId;
    private BigDecimal monto;
    private MetodoPago metodoPago;
    private LocalDateTime fechaPago;
}