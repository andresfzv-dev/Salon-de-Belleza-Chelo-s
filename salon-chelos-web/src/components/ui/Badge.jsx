import styles from './Badge.module.css'

const VARIANTS = {
  PENDIENTE: 'warning',
  COMPLETADA: 'success',
  CANCELADA: 'error',
  PRESENCIAL: 'info',
  WHATSAPP: 'info',
  WEB: 'info',
  EFECTIVO: 'neutral',
  TRANSFERENCIA: 'neutral'
}

const Badge = ({ label, variant }) => {
  const resolvedVariant = variant || VARIANTS[label] || 'neutral'
  return (
    <span className={`${styles.badge} ${styles[resolvedVariant]}`}>
      {label}
    </span>
  )
}

export default Badge