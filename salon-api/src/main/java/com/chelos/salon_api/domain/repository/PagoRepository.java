package com.chelos.salon_api.domain.repository;

import com.chelos.salon_api.domain.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface PagoRepository extends JpaRepository<Pago, UUID> {

    Optional<Pago> findByCitaId(UUID citaId);

    @Query("""
        SELECT COALESCE(SUM(p.monto), 0) FROM Pago p
        WHERE p.fechaPago BETWEEN :inicio AND :fin
    """)
    BigDecimal sumMontoByFechaPagoBetween(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );
}