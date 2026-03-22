package com.chelos.salon_api.application.service;

import com.chelos.salon_api.application.dto.request.CitaPublicaRequest;
import com.chelos.salon_api.application.dto.response.CitaResponse;
import com.chelos.salon_api.application.dto.response.DisponibilidadResponse;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaPublicaService {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    private static final LocalTime HORA_APERTURA = LocalTime.of(8, 0);
    private static final LocalTime HORA_CIERRE = LocalTime.of(19, 0);
    private static final int INTERVALO_MINUTOS = 30;

    @Transactional(readOnly = true)
    public DisponibilidadResponse consultarDisponibilidad(LocalDate fecha, Integer duracionMinutos) {
        if (fecha.isBefore(LocalDate.now())) {
            throw new BusinessException("No se pueden consultar fechas pasadas");
        }

        List<Object[]> horasOcupadasRaw = citaRepository.findHorasOcupadasByFecha(fecha);

        List<DisponibilidadResponse.HoraOcupada> horasOcupadas = horasOcupadasRaw.stream()
                .map(row -> DisponibilidadResponse.HoraOcupada.builder()
                        .horaInicio((LocalTime) row[0])
                        .horaFin((LocalTime) row[1])
                        .build())
                .toList();;

        List<LocalTime> horasDisponibles = new ArrayList<>();
        LocalTime hora = HORA_APERTURA;

        while (hora.plusMinutes(duracionMinutos).compareTo(HORA_CIERRE) <= 0) {
            LocalTime horaFin = hora.plusMinutes(duracionMinutos);
            final LocalTime horaActual = hora;
            boolean disponible = horasOcupadas.stream()
                    .noneMatch(ocupada ->
                            horaActual.isBefore(ocupada.getHoraFin()) &&
                                    horaFin.isAfter(ocupada.getHoraInicio())
                    );
            if (disponible) {
                horasDisponibles.add(horaActual);
            }
            hora = hora.plusMinutes(INTERVALO_MINUTOS);
        }

        return DisponibilidadResponse.builder()
                .horasDisponibles(horasDisponibles)
                .horasOcupadas(horasOcupadas)
                .build();
    }

    @Transactional
    public CitaResponse crearCitaPublica(CitaPublicaRequest request) {
        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", request.getServicioId()));

        if (request.getDuracionRealMinutos() < servicio.getDuracionMinMinutos() ||
                request.getDuracionRealMinutos() > servicio.getDuracionMaxMinutos()) {
            throw new BusinessException(String.format(
                    "La duración para '%s' debe estar entre %d y %d minutos",
                    servicio.getNombre(),
                    servicio.getDuracionMinMinutos(),
                    servicio.getDuracionMaxMinutos()
            ));
        }

        LocalTime horaFin = request.getHoraInicio().plusMinutes(request.getDuracionRealMinutos());

        boolean solapamiento = citaRepository.existeSolapamiento(
                request.getFecha(), request.getHoraInicio(), horaFin);

        if (solapamiento) {
            throw new BusinessException("El horario seleccionado ya no está disponible");
        }

        Cliente cliente = clienteRepository.findByTelefono(request.getTelefono())
                .orElseGet(() -> clienteRepository.save(
                        Cliente.builder()
                                .nombre(request.getNombre())
                                .telefono(request.getTelefono())
                                .email(request.getEmail())
                                .build()
                ));

        Cita cita = Cita.builder()
                .cliente(cliente)
                .servicio(servicio)
                .fecha(request.getFecha())
                .horaInicio(request.getHoraInicio())
                .horaFin(horaFin)
                .duracionRealMinutos(request.getDuracionRealMinutos())
                .estado(EstadoCita.PENDIENTE)
                .origen(OrigenCita.WEB)
                .build();

        Cita citaGuardada = citaRepository.save(cita);

        return CitaResponse.builder()
                .id(citaGuardada.getId())
                .clienteId(citaGuardada.getCliente().getId())
                .clienteNombre(citaGuardada.getCliente().getNombre())
                .servicioId(citaGuardada.getServicio().getId())
                .servicioNombre(citaGuardada.getServicio().getNombre())
                .fecha(citaGuardada.getFecha())
                .horaInicio(citaGuardada.getHoraInicio())
                .horaFin(citaGuardada.getHoraFin())
                .duracionRealMinutos(citaGuardada.getDuracionRealMinutos())
                .estado(citaGuardada.getEstado())
                .origen(citaGuardada.getOrigen())
                .build();
    }
}