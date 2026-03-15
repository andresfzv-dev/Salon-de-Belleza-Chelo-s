package com.chelos.salon_api.domain.repository;

import com.chelos.salon_api.domain.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ServicioRepository extends JpaRepository<Servicio, UUID> {

    Optional<Servicio> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}