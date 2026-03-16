package com.chelos.salon_api.infrastructure.controller;

import com.chelos.salon_api.application.dto.request.PagoRequest;
import com.chelos.salon_api.application.dto.response.PagoResponse;
import com.chelos.salon_api.application.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @PostMapping
    public ResponseEntity<PagoResponse> registrar(@Valid @RequestBody PagoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.registrar(request));
    }

    @GetMapping("/cita/{citaId}")
    public ResponseEntity<PagoResponse> buscarPorCita(@PathVariable UUID citaId) {
        return ResponseEntity.ok(pagoService.buscarPorCita(citaId));
    }

    @GetMapping("/reportes/diario")
    public ResponseEntity<BigDecimal> ingresosDiarios(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fecha) {
        return ResponseEntity.ok(pagoService.calcularIngresosDiarios(fecha));
    }

    @GetMapping("/reportes/mensual")
    public ResponseEntity<BigDecimal> ingresosMensuales(
            @RequestParam int anio,
            @RequestParam int mes) {
        return ResponseEntity.ok(pagoService.calcularIngresosMensuales(anio, mes));
    }
}