import { useState, useEffect } from 'react'
import { Input, Button } from '../../../components/ui'

const INITIAL_STATE = {
  nombre: '',
  precio: '',
  duracionMinMinutos: '',
  duracionMaxMinutos: ''
}

const ServicioForm = ({ servicio, onSubmit, isLoading }) => {
  const [form, setForm] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (servicio) {
      setForm({
        nombre: servicio.nombre,
        precio: servicio.precio,
        duracionMinMinutos: servicio.duracionMinMinutos,
        duracionMaxMinutos: servicio.duracionMaxMinutos
      })
    } else {
      setForm(INITIAL_STATE)
    }
    setErrors({})
  }, [servicio])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!form.precio || form.precio <= 0) newErrors.precio = 'El precio debe ser mayor a cero'
    if (!form.duracionMinMinutos || form.duracionMinMinutos < 1) newErrors.duracionMinMinutos = 'La duración mínima debe ser al menos 1 minuto'
    if (!form.duracionMaxMinutos || form.duracionMaxMinutos < 1) newErrors.duracionMaxMinutos = 'La duración máxima debe ser al menos 1 minuto'
    if (Number(form.duracionMinMinutos) > Number(form.duracionMaxMinutos)) {
      newErrors.duracionMaxMinutos = 'La duración máxima debe ser mayor o igual a la mínima'
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
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      duracionMinMinutos: Number(form.duracionMinMinutos),
      duracionMaxMinutos: Number(form.duracionMaxMinutos)
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="Nombre del servicio"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Corte de cabello"
        error={errors.nombre}
        required
      />
      <Input
        label="Precio (COP)"
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        placeholder="Ej: 25000"
        error={errors.precio}
        required
      />
      <Input
        label="Duración mínima (minutos)"
        name="duracionMinMinutos"
        type="number"
        value={form.duracionMinMinutos}
        onChange={handleChange}
        placeholder="Ej: 60"
        error={errors.duracionMinMinutos}
        required
      />
      <Input
        label="Duración máxima (minutos)"
        name="duracionMaxMinutos"
        type="number"
        value={form.duracionMaxMinutos}
        onChange={handleChange}
        placeholder="Ej: 90"
        error={errors.duracionMaxMinutos}
        required
      />
      <Button type="submit" loading={isLoading} fullWidth>
        {servicio ? 'Guardar cambios' : 'Crear servicio'}
      </Button>
    </form>
  )
}

export default ServicioForm