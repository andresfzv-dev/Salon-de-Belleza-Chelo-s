package com.chelos.salon_api.domain.repository;

import com.chelos.salon_api.domain.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    Optional<Cliente> findByTelefono(String telefono);
    Optional<Cliente> findByEmail(String email);
    boolean existsByTelefono(String telefono);
    boolean existsByEmail(String email);
}