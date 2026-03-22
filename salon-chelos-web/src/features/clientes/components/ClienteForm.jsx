import { useState, useEffect } from 'react'
import { Input, Button } from '../../../components/ui'

const INITIAL_STATE = {
  nombre: '',
  telefono: '',
  email: ''
}

const ClienteForm = ({ cliente, onSubmit, isLoading }) => {
  const [form, setForm] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email || ''
      })
    } else {
      setForm(INITIAL_STATE)
    }
    setErrors({})
  }, [cliente])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!form.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El correo no es válido'
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
      telefono: form.telefono.trim(),
      email: form.email.trim() || null
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="Nombre completo"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: María López"
        error={errors.nombre}
        required
      />
      <Input
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Ej: 3001234567"
        error={errors.telefono}
        required
      />
      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Ej: maria@gmail.com"
        error={errors.email}
        helperText="Opcional — se usa para enviar recordatorios"
      />
      <Button type="submit" loading={isLoading} fullWidth>
        {cliente ? 'Guardar cambios' : 'Registrar cliente'}
      </Button>
    </form>
  )
}

export default ClienteForm