import { useState } from 'react'
import { PageHeader, Table, Modal, Button } from '../components/ui'
import ClienteForm from '../features/clientes/components/ClienteForm'
import {
  useClientes,
  useCrearCliente,
  useActualizarCliente,
  useEliminarCliente,
  useBuscarClientePorTelefono
} from '../features/clientes/hooks/useClientes'
import styles from './ClientesPage.module.css'

const ClientesPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null)
  const [buscando, setBuscando] = useState(false)

  const { data: clientes, isLoading } = useClientes()
  const crear = useCrearCliente()
  const actualizar = useActualizarCliente()
  const eliminar = useEliminarCliente()
  const buscar = useBuscarClientePorTelefono()

  const handleNuevo = () => {
    setClienteSeleccionado(null)
    setModalOpen(true)
  }

  const handleEditar = (cliente) => {
    setClienteSeleccionado(cliente)
    setModalOpen(true)
  }

  const handleCerrar = () => {
    setModalOpen(false)
    setClienteSeleccionado(null)
  }

  const handleSubmit = (data) => {
    if (clienteSeleccionado) {
      actualizar.mutate(
        { id: clienteSeleccionado.id, data },
        { onSuccess: handleCerrar }
      )
    } else {
      crear.mutate(data, { onSuccess: handleCerrar })
    }
  }

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás segura de eliminar este cliente?')) {
      eliminar.mutate(id)
    }
  }

  const handleBuscar = async (e) => {
    e.preventDefault()
    if (!busqueda.trim()) return
    setBuscando(true)
    buscar.mutate(busqueda.trim(), {
      onSuccess: (data) => {
        setResultadoBusqueda([data])
        setBuscando(false)
      },
      onError: () => {
        setResultadoBusqueda([])
        setBuscando(false)
      }
    })
  }

  const handleLimpiarBusqueda = () => {
    setBusqueda('')
    setResultadoBusqueda(null)
  }

  const dataMostrada = resultadoBusqueda !== null ? resultadoBusqueda : clientes

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'email',
      label: 'Correo',
      render: (row) => row.email || <span style={{ color: 'var(--color-text-muted)' }}>—</span>
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
        title="Clientes"
        subtitle="Gestiona los clientes del salón"
        action={
          <Button onClick={handleNuevo}>+ Nuevo cliente</Button>
        }
      />

      <form className={styles.searchBar} onSubmit={handleBuscar}>
        <input
          className={styles.searchInput}
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por teléfono..."
        />
        <Button type="submit" loading={buscando}>
          Buscar
        </Button>
        {resultadoBusqueda !== null && (
          <Button variant="ghost" onClick={handleLimpiarBusqueda}>
            Ver todos
          </Button>
        )}
      </form>

      {isLoading ? (
        <div className={styles.loading}>Cargando clientes...</div>
      ) : (
        <Table
          columns={columns}
          data={dataMostrada}
          emptyTitle="Sin clientes registrados"
          emptyDescription="Registra los clientes del salón para comenzar a crear citas"
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrar}
        title={clienteSeleccionado ? 'Editar cliente' : 'Nuevo cliente'}
      >
        <ClienteForm
          cliente={clienteSeleccionado}
          onSubmit={handleSubmit}
          isLoading={crear.isPending || actualizar.isPending}
        />
      </Modal>
    </div>
  )
}

export default ClientesPage