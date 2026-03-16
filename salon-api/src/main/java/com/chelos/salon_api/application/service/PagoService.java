package com.chelos.salon_api.application.service;

import com.chelos.salon_api.application.dto.request.PagoRequest;
import com.chelos.salon_api.application.dto.response.PagoResponse;
import com.chelos.salon_api.application.exception.BusinessException;
import com.chelos.salon_api.application.exception.ConflictException;
import com.chelos.salon_api.application.exception.ResourceNotFoundException;
import com.chelos.salon_api.domain.model.Cita;
import com.chelos.salon_api.domain.model.EstadoCita;
import com.chelos.salon_api.domain.model.Pago;
import com.chelos.salon_api.domain.repository.CitaRepository;
import com.chelos.salon_api.domain.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final CitaRepository citaRepository;

    @Transactional
    public PagoResponse registrar(PagoRequest request) {
        Cita cita = citaRepository.findById(request.getCitaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cita", "id", request.getCitaId()));

        if (cita.getEstado() == EstadoCita.CANCELADA) {
            throw new BusinessException("No se puede registrar un pago para una cita cancelada");
        }

        if (pagoRepository.findByCitaId(cita.getId()).isPresent()) {
            throw new ConflictException("La cita ya tiene un pago registrado");
        }

        Pago pago = Pago.builder()
                .cita(cita)
                .monto(request.getMonto())
                .metodoPago(request.getMetodoPago())
                .fechaPago(LocalDateTime.now())
                .build();

        PagoResponse response = toResponse(pagoRepository.save(pago));

        cita.setEstado(EstadoCita.COMPLETADA);
        citaRepository.save(cita);

        return response;
    }

    @Transactional(readOnly = true)
    public PagoResponse buscarPorCita(UUID citaId) {
        if (!citaRepository.existsById(citaId)) {
            throw new ResourceNotFoundException("Cita", "id", citaId);
        }
        return pagoRepository.findByCitaId(citaId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "citaId", citaId));
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularIngresosDiarios(LocalDateTime fecha) {
        LocalDateTime inicioDia = fecha.toLocalDate().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1).minusNanos(1);
        return pagoRepository.sumMontoByFechaPagoBetween(inicioDia, finDia);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularIngresosMensuales(int anio, int mes) {
        LocalDateTime inicioMes = LocalDateTime.of(anio, mes, 1, 0, 0);
        LocalDateTime finMes = inicioMes.plusMonths(1).minusNanos(1);
        return pagoRepository.sumMontoByFechaPagoBetween(inicioMes, finMes);
    }

    private PagoResponse toResponse(Pago pago) {
        return PagoResponse.builder()
                .id(pago.getId())
                .citaId(pago.getCita().getId())
                .monto(pago.getMonto())
                .metodoPago(pago.getMetodoPago())
                .fechaPago(pago.getFechaPago())
                .build();
    }
}