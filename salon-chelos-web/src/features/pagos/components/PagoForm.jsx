import { useState } from 'react'
import { Button } from '../../../components/ui'
import { METODO_PAGO, METODO_PAGO_LABELS } from '../../../constants'
import styles from './PagoForm.module.css'

const PagoForm = ({ cita, onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    metodoPago: METODO_PAGO.EFECTIVO,
    monto: cita?.servicioNombre ? '' : ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.monto || form.monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a cero'
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
      citaId: cita.id,
      monto: Number(form.monto),
      metodoPago: form.metodoPago
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.citaInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Cliente</span>
          <span className={styles.infoValue}>{cita.clienteNombre}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Servicio</span>
          <span className={styles.infoValue}>{cita.servicioNombre}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Fecha</span>
          <span className={styles.infoValue}>{cita.fecha}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Monto (COP) <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            placeholder="Ej: 25000"
            className={`${styles.input} ${errors.monto ? styles.inputError : ''}`}
          />
          {errors.monto && <span className={styles.error}>{errors.monto}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Método de pago</label>
          <div className={styles.metodosGrid}>
            {Object.entries(METODO_PAGO_LABELS).map(([value, label]) => (
              <label
                key={value}
                className={`${styles.metodoOption} ${form.metodoPago === value ? styles.metodoSelected : ''}`}
              >
                <input
                  type="radio"
                  name="metodoPago"
                  value={value}
                  checked={form.metodoPago === value}
                  onChange={handleChange}
                  className={styles.radioHidden}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" loading={isLoading} fullWidth>
          Registrar pago
        </Button>
      </form>
    </div>
  )
}

export default PagoForm