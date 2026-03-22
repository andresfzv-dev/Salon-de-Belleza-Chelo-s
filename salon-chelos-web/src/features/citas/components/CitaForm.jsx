import { useState, useEffect } from 'react'
import { Input, Button } from '../../../components/ui'
import { useClientes } from '../../clientes/hooks/useClientes'
import { useServicios } from '../../servicios/hooks/useServicios'
import { ORIGEN_CITA, ORIGEN_CITA_LABELS } from '../../../constants'
import styles from './CitaForm.module.css'

const INITIAL_STATE = {
  clienteId: '',
  servicioId: '',
  fecha: '',
  horaInicio: '',
  duracionRealMinutos: '',
  origen: ORIGEN_CITA.PRESENCIAL
}

const CitaForm = ({ cita, onSubmit, isLoading }) => {
  const [form, setForm] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})

  const { data: clientes } = useClientes()
  const { data: servicios } = useServicios()

  useEffect(() => {
    if (cita) {
      setForm({
        clienteId: cita.clienteId,
        servicioId: cita.servicioId,
        fecha: cita.fecha,
        horaInicio: cita.horaInicio,
        duracionRealMinutos: cita.duracionRealMinutos,
        origen: cita.origen
      })
    } else {
      setForm(INITIAL_STATE)
    }
    setErrors({})
  }, [cita])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))

    if (name === 'servicioId') {
      const servicio = servicios?.find(s => s.id === value)
      if (servicio) {
        setForm(prev => ({
          ...prev,
          servicioId: value,
          duracionRealMinutos: servicio.duracionMinMinutos
        }))
      }
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.clienteId) newErrors.clienteId = 'El cliente es obligatorio'
    if (!form.servicioId) newErrors.servicioId = 'El servicio es obligatorio'
    if (!form.fecha) newErrors.fecha = 'La fecha es obligatoria'
    if (!form.horaInicio) newErrors.horaInicio = 'La hora es obligatoria'
    if (!form.duracionRealMinutos || form.duracionRealMinutos < 1) {
      newErrors.duracionRealMinutos = 'La duración es obligatoria'
    }

    const servicioSeleccionado = servicios?.find(s => s.id === form.servicioId)
    if (servicioSeleccionado && form.duracionRealMinutos) {
      const dur = Number(form.duracionRealMinutos)
      if (dur < servicioSeleccionado.duracionMinMinutos || dur > servicioSeleccionado.duracionMaxMinutos) {
        newErrors.duracionRealMinutos = `La duración debe estar entre ${servicioSeleccionado.duracionMinMinutos} y ${servicioSeleccionado.duracionMaxMinutos} minutos`
      }
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      clienteId: form.clienteId,
      servicioId: form.servicioId,
      fecha: form.fecha,
      horaInicio: form.horaInicio + ':00',
      duracionRealMinutos: Number(form.duracionRealMinutos),
      origen: form.origen
    })
  }

  const servicioSeleccionado = servicios?.find(s => s.id === form.servicioId)

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>
          Cliente <span className={styles.required}>*</span>
        </label>
        <select
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          className={`${styles.select} ${errors.clienteId ? styles.selectError : ''}`}
        >
          <option value="">Seleccionar cliente...</option>
          {clientes?.map(c => (
            <option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>
          ))}
        </select>
        {errors.clienteId && <span className={styles.error}>{errors.clienteId}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Servicio <span className={styles.required}>*</span>
        </label>
        <select
          name="servicioId"
          value={form.servicioId}
          onChange={handleChange}
          className={`${styles.select} ${errors.servicioId ? styles.selectError : ''}`}
        >
          <option value="">Seleccionar servicio...</option>
          {servicios?.map(s => (
            <option key={s.id} value={s.id}>
              {s.nombre} — ${s.precio.toLocaleString('es-CO')}
            </option>
          ))}
        </select>
        {errors.servicioId && <span className={styles.error}>{errors.servicioId}</span>}
      </div>

      {servicioSeleccionado && (
        <div className={styles.servicioInfo}>
          Duración: {servicioSeleccionado.duracionMinMinutos === servicioSeleccionado.duracionMaxMinutos
            ? `${servicioSeleccionado.duracionMinMinutos} min`
            : `${servicioSeleccionado.duracionMinMinutos} - ${servicioSeleccionado.duracionMaxMinutos} min`
          } · Precio: ${servicioSeleccionado.precio.toLocaleString('es-CO')}
        </div>
      )}

      <div className={styles.row}>
        <Input
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          error={errors.fecha}
          required
        />
        <Input
          label="Hora de inicio"
          name="horaInicio"
          type="time"
          value={form.horaInicio}
          onChange={handleChange}
          error={errors.horaInicio}
          required
        />
      </div>

      <Input
        label="Duración real (minutos)"
        name="duracionRealMinutos"
        type="number"
        value={form.duracionRealMinutos}
        onChange={handleChange}
        error={errors.duracionRealMinutos}
        helperText={servicioSeleccionado
          ? `Entre ${servicioSeleccionado.duracionMinMinutos} y ${servicioSeleccionado.duracionMaxMinutos} minutos`
          : undefined
        }
        required
      />

      <div className={styles.field}>
        <label className={styles.label}>Origen</label>
        <select
          name="origen"
          value={form.origen}
          onChange={handleChange}
          className={styles.select}
        >
          {Object.entries(ORIGEN_CITA_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <Button type="submit" loading={isLoading} fullWidth>
        {cita ? 'Guardar cambios' : 'Crear cita'}
      </Button>
    </form>
  )
}

export default CitaForm