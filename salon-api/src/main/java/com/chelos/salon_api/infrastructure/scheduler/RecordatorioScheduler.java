package com.chelos.salon_api.infrastructure.scheduler;

import com.chelos.salon_api.domain.model.Cita;
import com.chelos.salon_api.domain.model.EstadoCita;
import com.chelos.salon_api.domain.repository.CitaRepository;
import com.chelos.salon_api.infrastructure.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class RecordatorioScheduler {

    private final CitaRepository citaRepository;
    private final EmailService emailService;

    private static final DateTimeFormatter FORMATO_FECHA =
            DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy",
                    java.util.Locale.forLanguageTag("es"));

    @Scheduled(cron = "0 0 18 * * *")
    public void enviarRecordatorios() {
        LocalDate manana = LocalDate.now().plusDays(1);
        log.info("Ejecutando scheduler de recordatorios para: {}", manana);

        List<Cita> citasManana = citaRepository.findByFecha(manana)
                .stream()
                .filter(c -> c.getEstado() == EstadoCita.PENDIENTE)
                .filter(c -> c.getCliente().getEmail() != null &&
                        !c.getCliente().getEmail().isBlank())
                .toList();

        log.info("Citas con recordatorio pendiente: {}", citasManana.size());

        citasManana.forEach(cita -> {
            try {
                emailService.enviarRecordatorio(
                        cita.getCliente().getEmail(),
                        cita.getCliente().getNombre(),
                        cita.getServicio().getNombre(),
                        cita.getFecha().format(FORMATO_FECHA),
                        cita.getHoraInicio().toString().substring(0, 5)
                );
            } catch (Exception e) {
                log.error("Error enviando recordatorio para cita {}: {}",
                        cita.getId(), e.getMessage());
            }
        });

        log.info("Scheduler de recordatorios completado");
    }
}