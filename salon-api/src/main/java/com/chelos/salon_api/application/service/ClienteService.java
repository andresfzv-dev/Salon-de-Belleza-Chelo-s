package com.chelos.salon_api.application.service;

import com.chelos.salon_api.application.dto.request.ClienteRequest;
import com.chelos.salon_api.application.dto.response.ClienteResponse;
import com.chelos.salon_api.application.exception.ConflictException;
import com.chelos.salon_api.application.exception.ResourceNotFoundException;
import com.chelos.salon_api.domain.model.Cliente;
import com.chelos.salon_api.domain.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional
    public ClienteResponse crear(ClienteRequest request) {
        if (clienteRepository.existsByTelefono(request.getTelefono())) {
            throw new ConflictException("Ya existe un cliente con el teléfono: " + request.getTelefono());
        }
        if (request.getEmail() != null && clienteRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Ya existe un cliente con el email: " + request.getEmail());
        }
        Cliente cliente = Cliente.builder()
                .nombre(request.getNombre())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .build();

        return toResponse(clienteRepository.save(cliente));
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(UUID id) {
        return clienteRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorTelefono(String telefono) {
        return clienteRepository.findByTelefono(telefono)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "teléfono", telefono));
    }

    @Transactional
    public ClienteResponse actualizar(UUID id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));

        if (!cliente.getTelefono().equals(request.getTelefono()) &&
                clienteRepository.existsByTelefono(request.getTelefono())) {
            throw new ConflictException("Ya existe un cliente con el teléfono: " + request.getTelefono());
        }

        if (request.getEmail() != null &&
                !request.getEmail().equals(cliente.getEmail()) &&
                clienteRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Ya existe un cliente con el email: " + request.getEmail());
        }

        cliente.setNombre(request.getNombre());
        cliente.setTelefono(request.getTelefono());
        cliente.setEmail(request.getEmail());

        return toResponse(clienteRepository.save(cliente));
    }

    @Transactional
    public void eliminar(UUID id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente", "id", id);
        }
        clienteRepository.deleteById(id);
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .nombre(cliente.getNombre())
                .telefono(cliente.getTelefono())
                .email(cliente.getEmail())
                .build();
    }
}