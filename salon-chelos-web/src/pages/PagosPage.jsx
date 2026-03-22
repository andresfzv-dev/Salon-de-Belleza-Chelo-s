import { useState } from 'react'
import { PageHeader, Table, Modal, Badge } from '../components/ui'
import PagoForm from '../features/pagos/components/PagoForm'
import { useRegistrarPago } from '../features/pagos/hooks/usePagos'
import { useCitas } from '../features/citas/hooks/useCitas'
import { ESTADO_CITA, ESTADO_CITA_LABELS, METODO_PAGO_LABELS } from '../constants'
import styles from './PagosPage.module.css'

const PagosPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [citaSeleccionada, setCitaSeleccionada] = useState(null)

  const { data: citas, isLoading } = useCitas()
  const registrar = useRegistrarPago()

  const citasPendientes = citas?.filter(c => c.estado === ESTADO_CITA.PENDIENTE) || []
  const citasCompletadas = citas?.filter(c => c.estado === ESTADO_CITA.COMPLETADA) || []

  const handleRegistrarPago = (cita) => {
    setCitaSeleccionada(cita)
    setModalOpen(true)
  }

  const handleCerrar = () => {
    setModalOpen(false)
    setCitaSeleccionada(null)
  }

  const handleSubmit = (data) => {
    registrar.mutate(data, { onSuccess: handleCerrar })
  }

  const columnsPendientes = [
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'servicioNombre', label: 'Servicio' },
    { key: 'fecha', label: 'Fecha' },
    {
      key: 'horario',
      label: 'Horario',
      render: (row) => `${row.horaInicio?.slice(0, 5)} — ${row.horaFin?.slice(0, 5)}`
    },
    {
      key: 'acciones',
      label: '',
      render: (row) => (
        <button
          className={styles.pagarBtn}
          onClick={() => handleRegistrarPago(row)}
        >
          Registrar pago
        </button>
      )
    }
  ]

  const columnsCompletadas = [
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'servicioNombre', label: 'Servicio' },
    { key: 'fecha', label: 'Fecha' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => (
        <Badge
          label={ESTADO_CITA_LABELS[row.estado]}
          variant="success"
        />
      )
    }
  ]

  return (
    <div>
      <PageHeader
        title="Pagos"
        subtitle="Registra los pagos de las citas completadas"
      />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Citas pendientes de pago</h2>
        {isLoading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : (
          <Table
            columns={columnsPendientes}
            data={citasPendientes}
            emptyTitle="Sin citas pendientes"
            emptyDescription="Todas las citas han sido pagadas"
          />
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Citas completadas</h2>
        {isLoading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : (
          <Table
            columns={columnsCompletadas}
            data={citasCompletadas}
            emptyTitle="Sin citas completadas"
            emptyDescription="Las citas completadas aparecerán aquí"
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrar}
        title="Registrar pago"
      >
        {citaSeleccionada && (
          <PagoForm
            cita={citaSeleccionada}
            onSubmit={handleSubmit}
            isLoading={registrar.isPending}
          />
        )}
      </Modal>
    </div>
  )
}

export default PagosPage