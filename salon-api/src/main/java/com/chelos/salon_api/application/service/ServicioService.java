package com.chelos.salon_api.application.service;

import com.chelos.salon_api.application.dto.request.ServicioRequest;
import com.chelos.salon_api.application.dto.response.ServicioResponse;
import com.chelos.salon_api.application.exception.ConflictException;
import com.chelos.salon_api.application.exception.ResourceNotFoundException;
import com.chelos.salon_api.application.exception.BusinessException;
import com.chelos.salon_api.domain.model.Servicio;
import com.chelos.salon_api.domain.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private final ServicioRepository servicioRepository;

    @Transactional
    public ServicioResponse crear(ServicioRequest request) {
        validarDuraciones(request);

        if (servicioRepository.existsByNombre(request.getNombre())) {
            throw new ConflictException("Ya existe un servicio con el nombre: " + request.getNombre());
        }

        Servicio servicio = Servicio.builder()
                .nombre(request.getNombre())
                .precio(request.getPrecio())
                .duracionMinMinutos(request.getDuracionMinMinutos())
                .duracionMaxMinutos(request.getDuracionMaxMinutos())
                .build();

        return toResponse(servicioRepository.save(servicio));
    }

    @Transactional(readOnly = true)
    public List<ServicioResponse> listarTodos() {
        return servicioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServicioResponse buscarPorId(UUID id) {
        return servicioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));
    }

    @Transactional
    public ServicioResponse actualizar(UUID id, ServicioRequest request) {
        validarDuraciones(request);

        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));

        if (!servicio.getNombre().equals(request.getNombre()) &&
                servicioRepository.existsByNombre(request.getNombre())) {
            throw new ConflictException("Ya existe un servicio con el nombre: " + request.getNombre());
        }

        servicio.setNombre(request.getNombre());
        servicio.setPrecio(request.getPrecio());
        servicio.setDuracionMinMinutos(request.getDuracionMinMinutos());
        servicio.setDuracionMaxMinutos(request.getDuracionMaxMinutos());

        return toResponse(servicioRepository.save(servicio));
    }

    @Transactional
    public void eliminar(UUID id) {
        if (!servicioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio", "id", id);
        }
        servicioRepository.deleteById(id);
    }

    private void validarDuraciones(ServicioRequest request) {
        if (request.getDuracionMinMinutos() > request.getDuracionMaxMinutos()) {
            throw new BusinessException("La duración mínima no puede ser mayor a la duración máxima");
        }
    }

    private ServicioResponse toResponse(Servicio servicio) {
        return ServicioResponse.builder()
                .id(servicio.getId())
                .nombre(servicio.getNombre())
                .precio(servicio.getPrecio())
                .duracionMinMinutos(servicio.getDuracionMinMinutos())
                .duracionMaxMinutos(servicio.getDuracionMaxMinutos())
                .build();
    }
}