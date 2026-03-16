package com.chelos.salon_api.application.service;

import com.chelos.salon_api.application.dto.request.CitaRequest;
import com.chelos.salon_api.application.dto.response.CitaResponse;
import com.chelos.salon_api.application.exception.BusinessException;
import com.chelos.salon_api.application.exception.ResourceNotFoundException;
import com.chelos.salon_api.domain.model.*;
import com.chelos.salon_api.domain.repository.CitaRepository;
import com.chelos.salon_api.domain.repository.ClienteRepository;
import com.chelos.salon_api.domain.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    @Transactional
    public CitaResponse crear(CitaRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", request.getClienteId()));

        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", request.getServicioId()));

        validarDuracion(request.getDuracionRealMinutos(), servicio);

        LocalTime horaFin = request.getHoraInicio()
                .plusMinutes(request.getDuracionRealMinutos());

        validarHorario(request.getFecha(), request.getHoraInicio(), horaFin, null);

        Cita cita = Cita.builder()
                .cliente(cliente)
                .servicio(servicio)
                .fecha(request.getFecha())
                .horaInicio(request.getHoraInicio())
                .horaFin(horaFin)
                .duracionRealMinutos(request.getDuracionRealMinutos())
                .estado(EstadoCita.PENDIENTE)
                .origen(request.getOrigen())
                .build();

        return toResponse(citaRepository.save(cita));
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarTodas() {
        return citaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorFecha(LocalDate fecha) {
        return citaRepository.findByFecha(fecha)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorCliente(UUID clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new ResourceNotFoundException("Cliente", "id", clienteId);
        }
        return citaRepository.findByClienteId(clienteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CitaResponse buscarPorId(UUID id) {
        return citaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Cita", "id", id));
    }

    @Transactional
    public CitaResponse actualizar(UUID id, CitaRequest request) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita", "id", id));

        if (cita.getEstado() == EstadoCita.CANCELADA) {
            throw new BusinessException("No se puede modificar una cita cancelada");
        }

        if (cita.getEstado() == EstadoCita.COMPLETADA) {
            throw new BusinessException("No se puede modificar una cita completada");
        }

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", request.getClienteId()));

        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", request.getServicioId()));

        validarDuracion(request.getDuracionRealMinutos(), servicio);

        LocalTime horaFin = request.getHoraInicio()
                .plusMinutes(request.getDuracionRealMinutos());

        validarHorario(request.getFecha(), request.getHoraInicio(), horaFin, id);

        cita.setCliente(cliente);
        cita.setServicio(servicio);
        cita.setFecha(request.getFecha());
        cita.setHoraInicio(request.getHoraInicio());
        cita.setHoraFin(horaFin);
        cita.setDuracionRealMinutos(request.getDuracionRealMinutos());
        cita.setOrigen(request.getOrigen());

        return toResponse(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponse cambiarEstado(UUID id, EstadoCita nuevoEstado) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita", "id", id));

        validarTransicionEstado(cita.getEstado(), nuevoEstado);

        cita.setEstado(nuevoEstado);
        return toResponse(citaRepository.save(cita));
    }

    private void validarDuracion(Integer duracionReal, Servicio servicio) {
        if (duracionReal < servicio.getDuracionMinMinutos() ||
                duracionReal > servicio.getDuracionMaxMinutos()) {
            throw new BusinessException(String.format(
                    "La duración para '%s' debe estar entre %d y %d minutos",
                    servicio.getNombre(),
                    servicio.getDuracionMinMinutos(),
                    servicio.getDuracionMaxMinutos()
            ));
        }
    }

    private void validarHorario(LocalDate fecha, LocalTime horaInicio,
                                LocalTime horaFin, UUID citaIdExcluir) {
        boolean solapamiento = citaIdExcluir == null
                ? citaRepository.existeSolapamiento(fecha, horaInicio, horaFin)
                : citaRepository.existeSolapamientoExcluyendo(fecha, horaInicio, horaFin, citaIdExcluir);

        if (solapamiento) {
            throw new BusinessException(String.format(
                    "Ya existe una cita programada entre las %s y las %s",
                    horaInicio, horaFin
            ));
        }
    }

    private void validarTransicionEstado(EstadoCita estadoActual, EstadoCita nuevoEstado) {
        if (estadoActual == EstadoCita.CANCELADA) {
            throw new BusinessException("No se puede cambiar el estado de una cita cancelada");
        }
        if (estadoActual == EstadoCita.COMPLETADA && nuevoEstado != EstadoCita.CANCELADA) {
            throw new BusinessException("Una cita completada solo puede cancelarse");
        }
    }

    private CitaResponse toResponse(Cita cita) {
        return CitaResponse.builder()
                .id(cita.getId())
                .clienteId(cita.getCliente().getId())
                .clienteNombre(cita.getCliente().getNombre())
                .servicioId(cita.getServicio().getId())
                .servicioNombre(cita.getServicio().getNombre())
                .fecha(cita.getFecha())
                .horaInicio(cita.getHoraInicio())
                .horaFin(cita.getHoraFin())
                .duracionRealMinutos(cita.getDuracionRealMinutos())
                .estado(cita.getEstado())
                .origen(cita.getOrigen())
                .build();
    }
}