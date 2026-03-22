package com.chelos.salon_api.infrastructure.controller;

import com.chelos.salon_api.application.dto.request.CitaPublicaRequest;
import com.chelos.salon_api.application.dto.response.CitaResponse;
import com.chelos.salon_api.application.dto.response.DisponibilidadResponse;
import com.chelos.salon_api.application.service.CitaPublicaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class CitaPublicaController {

    private final CitaPublicaService citaPublicaService;

    @GetMapping("/disponibilidad")
    public ResponseEntity<DisponibilidadResponse> consultarDisponibilidad(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Integer duracionMinutos) {
        return ResponseEntity.ok(citaPublicaService.consultarDisponibilidad(fecha, duracionMinutos));
    }

    @PostMapping("/citas")
    public ResponseEntity<CitaResponse> crearCita(@Valid @RequestBody CitaPublicaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(citaPublicaService.crearCitaPublica(request));
    }
}
