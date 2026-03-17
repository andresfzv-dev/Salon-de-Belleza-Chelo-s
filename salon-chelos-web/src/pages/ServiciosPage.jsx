import { useState } from 'react'
import { PageHeader, Table, Modal, Button, Badge } from '../components/ui'
import ServicioForm from '../features/servicios/components/ServicioForm'
import {
  useServicios,
  useCrearServicio,
  useActualizarServicio,
  useEliminarServicio
} from '../features/servicios/hooks/useServicios'
import styles from './ServiciosPage.module.css'

const ServiciosPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)

  const { data: servicios, isLoading } = useServicios()
  const crear = useCrearServicio()
  const actualizar = useActualizarServicio()
  const eliminar = useEliminarServicio()

  const handleNuevo = () => {
    setServicioSeleccionado(null)
    setModalOpen(true)
  }

  const handleEditar = (servicio) => {
    setServicioSeleccionado(servicio)
    setModalOpen(true)
  }

  const handleCerrar = () => {
    setModalOpen(false)
    setServicioSeleccionado(null)
  }

  const handleSubmit = (data) => {
    if (servicioSeleccionado) {
      actualizar.mutate(
        { id: servicioSeleccionado.id, data },
        { onSuccess: handleCerrar }
      )
    } else {
      crear.mutate(data, { onSuccess: handleCerrar })
    }
  }

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás segura de eliminar este servicio?')) {
      eliminar.mutate(id)
    }
  }

  const columns = [
    { key: 'nombre', label: 'Servicio' },
    {
      key: 'precio',
      label: 'Precio',
      render: (row) => `$${row.precio.toLocaleString('es-CO')}`
    },
    {
      key: 'duracion',
      label: 'Duración',
      render: (row) =>
        row.duracionMinMinutos === row.duracionMaxMinutos
          ? `${row.duracionMinMinutos} min`
          : `${row.duracionMinMinutos} - ${row.duracionMaxMinutos} min`
    },
    {
      key: 'acciones',
      label: '',
      render: (row) => (
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={() => handleEditar(row)}>
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleEliminar(row.id)}
            loading={eliminar.isPending}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ]

  return (
    <div>
      <PageHeader
        title="Servicios"
        subtitle="Gestiona los servicios que ofrece el salón"
        action={
          <Button onClick={handleNuevo}>
            + Nuevo servicio
          </Button>
        }
      />

      {isLoading ? (
        <div className={styles.loading}>Cargando servicios...</div>
      ) : (
        <Table
          columns={columns}
          data={servicios}
          emptyTitle="Sin servicios registrados"
          emptyDescription="Agrega los servicios que ofrece el salón para comenzar a crear citas"
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrar}
        title={servicioSeleccionado ? 'Editar servicio' : 'Nuevo servicio'}
      >
        <ServicioForm
          servicio={servicioSeleccionado}
          onSubmit={handleSubmit}
          isLoading={crear.isPending || actualizar.isPending}
        />
      </Modal>
    </div>
  )
}

export default ServiciosPage