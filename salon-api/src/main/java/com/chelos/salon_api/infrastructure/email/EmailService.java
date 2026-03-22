package com.chelos.salon_api.infrastructure.email;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    private final Resend resend;
    private final String from;

    public EmailService(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from}") String from) {
        this.resend = new Resend(apiKey);
        this.from = from;
    }

    public void enviarRecordatorio(String destinatario, String nombreCliente,
                                   String servicio, String fecha, String hora) {
        String asunto = "Recordatorio de tu cita en Salón Chelo's";
        String html = buildHtml(nombreCliente, servicio, fecha, hora);

        try {
            CreateEmailOptions options = CreateEmailOptions.builder()
                    .from(from)
                    .to(destinatario)
                    .subject(asunto)
                    .html(html)
                    .build();

            resend.emails().send(options);
            log.info("Recordatorio enviado a: {}", destinatario);
        } catch (ResendException e) {
            log.error("Error enviando recordatorio a {}: {}", destinatario, e.getMessage());
        }
    }

    private String buildHtml(String nombre, String servicio, String fecha, String hora) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Georgia', serif; background-color: #F0EBE3; margin: 0; padding: 20px; }
                    .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; }
                    .header { background-color: #1A1A1A; padding: 32px; text-align: center; }
                    .brand { color: #fff; font-size: 28px; margin: 0; }
                    .brand-sub { color: #F01F6F; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 4px 0 0; }
                    .body { padding: 32px; }
                    .greeting { font-size: 18px; color: #1A1A1A; margin-bottom: 16px; }
                    .message { font-size: 15px; color: #6B6B6B; line-height: 1.6; margin-bottom: 24px; }
                    .cita-card { background: #FAF7F4; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
                    .cita-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
                    .cita-label { font-size: 12px; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.8px; }
                    .cita-valor { font-size: 14px; color: #1A1A1A; font-weight: bold; }
                    .footer { text-align: center; padding: 20px 32px; border-top: 1px solid #E8DDD3; }
                    .footer p { font-size: 12px; color: #9E9E9E; margin: 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="brand">Chelo's</h1>
                        <p class="brand-sub">Salón de Belleza</p>
                    </div>
                    <div class="body">
                        <p class="greeting">Hola, %s 👋</p>
                        <p class="message">
                            Te recordamos que tienes una cita programada para mañana en el Salón Chelo's.
                            ¡Te esperamos!
                        </p>
                        <div class="cita-card">
                            <div class="cita-row">
                                <span class="cita-label">Servicio</span>
                                <span class="cita-valor">%s</span>
                            </div>
                            <div class="cita-row">
                                <span class="cita-label">Fecha</span>
                                <span class="cita-valor">%s</span>
                            </div>
                            <div class="cita-row" style="margin-bottom: 0">
                                <span class="cita-label">Hora</span>
                                <span class="cita-valor">%s</span>
                            </div>
                        </div>
                        <p class="message">
                            Si necesitas cancelar o reprogramar tu cita, comunícate con nosotros
                            por WhatsApp con anticipación.
                        </p>
                    </div>
                    <div class="footer">
                        <p>Salón de Belleza Chelo's · Armenia, Quindío</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(nombre, servicio, fecha, hora);
    }
}