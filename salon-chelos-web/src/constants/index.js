export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const TOKEN_KEY = 'chelos_token'
export const USER_KEY = 'chelos_user'

export const ESTADO_CITA = {
  PENDIENTE: 'PENDIENTE',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
}

export const ORIGEN_CITA = {
  PRESENCIAL: 'PRESENCIAL',
  WHATSAPP: 'WHATSAPP',
  WEB: 'WEB'
}

export const METODO_PAGO = {
  EFECTIVO: 'EFECTIVO',
  TRANSFERENCIA: 'TRANSFERENCIA'
}

export const ESTADO_CITA_LABELS = {
  PENDIENTE: 'Pendiente',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada'
}

export const ORIGEN_CITA_LABELS = {
  PRESENCIAL: 'Presencial',
  WHATSAPP: 'WhatsApp',
  WEB: 'Web'
}

export const METODO_PAGO_LABELS = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia'
}