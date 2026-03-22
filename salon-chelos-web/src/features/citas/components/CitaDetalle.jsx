import { Badge, Button } from '../../../components/ui'
import { ESTADO_CITA, ESTADO_CITA_LABELS, ORIGEN_CITA_LABELS } from '../../../constants'
import { useCambiarEstadoCita } from '../hooks/useCitas'
import styles from './CitaDetalle.module.css'

const CitaDetalle = ({ cita, onEditar, onCerrar }) => {
  const cambiarEstado = useCambiarEstadoCita()

  const handleCambiarEstado = (estado) => {
    cambiarEstado.mutate({ id: cita.id, estado }, { onSuccess: onCerrar })
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Cliente</span>
        <span className={styles.sectionValue}>{cita.clienteNombre}</span>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Servicio</span>
        <span className={styles.sectionValue}>{cita.servicioNombre}</span>
      </div>

      <div className={styles.row}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Fecha</span>
          <span className={styles.sectionValue}>{cita.fecha}</span>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Horario</span>
          <span className={styles.sectionValue}>
            {cita.horaInicio?.slice(0, 5)} — {cita.horaFin?.slice(0, 5)}
          </span>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Estado</span>
          <Badge label={ESTADO_CITA_LABELS[cita.estado]} variant={
            cita.estado === ESTADO_CITA.PENDIENTE ? 'warning' :
            cita.estado === ESTADO_CITA.COMPLETADA ? 'success' : 'error'
          } />
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Origen</span>
          <span className={styles.sectionValue}>{ORIGEN_CITA_LABELS[cita.origen]}</span>
        </div>
      </div>

      {cita.estado === ESTADO_CITA.PENDIENTE && (
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEditar(cita)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            onClick={() => handleCambiarEstado(ESTADO_CITA.COMPLETADA)}
            loading={cambiarEstado.isPending}
          >
            Marcar completada
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleCambiarEstado(ESTADO_CITA.CANCELADA)}
            loading={cambiarEstado.isPending}
          >
            Cancelar cita
          </Button>
        </div>
      )}
    </div>
  )
}

export default CitaDetalle