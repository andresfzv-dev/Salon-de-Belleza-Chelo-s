package com.chelos.salon_api.domain.repository;

import com.chelos.salon_api.domain.model.Cita;
import com.chelos.salon_api.domain.model.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface CitaRepository extends JpaRepository<Cita, UUID> {

    List<Cita> findByFecha(LocalDate fecha);
    List<Cita> findByClienteId(UUID clienteId);
    List<Cita> findByFechaBetween(LocalDate inicio, LocalDate fin);

    @Query("""
        SELECT COUNT(c) > 0 FROM Cita c
        WHERE c.fecha = :fecha
        AND c.estado != 'CANCELADA'
        AND (
            (c.horaInicio < :horaFin AND c.horaFin > :horaInicio)
        )
    """)
    boolean existeSolapamiento(
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    @Query("""
    SELECT COUNT(c) > 0 FROM Cita c
    WHERE c.fecha = :fecha
    AND c.id != :citaId
    AND c.estado != 'CANCELADA'
    AND (c.horaInicio < :horaFin AND c.horaFin > :horaInicio)
""")
    boolean existeSolapamientoExcluyendo(
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("citaId") UUID citaId
    );
}