import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { PageHeader, Modal, Button } from '../components/ui'
import CitaForm from '../features/citas/components/CitaForm'
import CitaDetalle from '../features/citas/components/CitaDetalle'
import { useCitas, useCrearCita, useActualizarCita } from '../features/citas/hooks/useCitas'
import { ESTADO_CITA } from '../constants'
import styles from './CitasPage.module.css'

const COLORES_ESTADO = {
  PENDIENTE: { backgroundColor: '#FFF3E0', borderColor: '#E65100', textColor: '#E65100' },
  COMPLETADA: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32', textColor: '#2E7D32' },
  CANCELADA: { backgroundColor: '#FFEBEE', borderColor: '#C62828', textColor: '#C62828' }
}

const CitasPage = () => {
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false)
  const [citaSeleccionada, setCitaSeleccionada] = useState(null)
  const [fechaInicial, setFechaInicial] = useState('')

  const { data: citas, isLoading } = useCitas()
  const crear = useCrearCita()
  const actualizar = useActualizarCita()

  const eventos = useMemo(() => {
    if (!citas) return []
    return citas.map(cita => ({
      id: cita.id,
      title: `${cita.clienteNombre} — ${cita.servicioNombre}`,
      start: `${cita.fecha}T${cita.horaInicio}`,
      end: `${cita.fecha}T${cita.horaFin}`,
      ...COLORES_ESTADO[cita.estado],
      extendedProps: { cita }
    }))
  }, [citas])

  const handleNueva = () => {
    setCitaSeleccionada(null)
    setFechaInicial('')
    setModalFormOpen(true)
  }

  const handleDateClick = (info) => {
    setCitaSeleccionada(null)
    setFechaInicial(info.dateStr)
    setModalFormOpen(true)
  }

  const handleEventClick = (info) => {
    setCitaSeleccionada(info.event.extendedProps.cita)
    setModalDetalleOpen(true)
  }

  const handleEditar = (cita) => {
    setModalDetalleOpen(false)
    setCitaSeleccionada(cita)
    setModalFormOpen(true)
  }

  const handleCerrarForm = () => {
    setModalFormOpen(false)
    setCitaSeleccionada(null)
    setFechaInicial('')
  }

  const handleCerrarDetalle = () => {
    setModalDetalleOpen(false)
    setCitaSeleccionada(null)
  }

  const handleSubmit = (data) => {
    const payload = fechaInicial && !citaSeleccionada
      ? { ...data, fecha: fechaInicial }
      : data

    if (citaSeleccionada) {
      actualizar.mutate(
        { id: citaSeleccionada.id, data },
        { onSuccess: handleCerrarForm }
      )
    } else {
      crear.mutate(payload, { onSuccess: handleCerrarForm })
    }
  }

  return (
    <div>
      <PageHeader
        title="Citas"
        subtitle="Gestiona el calendario de citas del salón"
        action={
          <Button onClick={handleNueva}>+ Nueva cita</Button>
        }
      />

      <div className={styles.calendarWrapper}>
        {!isLoading && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día'
            }}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            events={eventos}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
          />
        )}
      </div>

      <Modal
        isOpen={modalFormOpen}
        onClose={handleCerrarForm}
        title={citaSeleccionada ? 'Editar cita' : 'Nueva cita'}
        size="lg"
      >
        <CitaForm
          cita={citaSeleccionada}
          fechaInicial={fechaInicial}
          onSubmit={handleSubmit}
          isLoading={crear.isPending || actualizar.isPending}
        />
      </Modal>

      <Modal
        isOpen={modalDetalleOpen}
        onClose={handleCerrarDetalle}
        title="Detalle de cita"
      >
        {citaSeleccionada && (
          <CitaDetalle
            cita={citaSeleccionada}
            onEditar={handleEditar}
            onCerrar={handleCerrarDetalle}
          />
        )}
      </Modal>
    </div>
  )
}

export default CitasPage