import axiosInstance from './axiosInstance'

export const authApi = {
  login: (data) => axiosInstance.post('/auth/login', data)
}

export const clientesApi = {
  listar: () => axiosInstance.get('/clientes'),
  buscarPorId: (id) => axiosInstance.get(`/clientes/${id}`),
  buscarPorTelefono: (telefono) => axiosInstance.get(`/clientes/buscar?telefono=${telefono}`),
  crear: (data) => axiosInstance.post('/clientes', data),
  actualizar: (id, data) => axiosInstance.put(`/clientes/${id}`, data),
  eliminar: (id) => axiosInstance.delete(`/clientes/${id}`)
}

export const serviciosApi = {
  listar: () => axiosInstance.get('/servicios'),
  buscarPorId: (id) => axiosInstance.get(`/servicios/${id}`),
  crear: (data) => axiosInstance.post('/servicios', data),
  actualizar: (id, data) => axiosInstance.put(`/servicios/${id}`, data),
  eliminar: (id) => axiosInstance.delete(`/servicios/${id}`)
}

export const citasApi = {
  listar: () => axiosInstance.get('/citas'),
  listarPorFecha: (fecha) => axiosInstance.get(`/citas/fecha?fecha=${fecha}`),
  listarPorCliente: (clienteId) => axiosInstance.get(`/citas/cliente/${clienteId}`),
  buscarPorId: (id) => axiosInstance.get(`/citas/${id}`),
  crear: (data) => axiosInstance.post('/citas', data),
  actualizar: (id, data) => axiosInstance.put(`/citas/${id}`, data),
  cambiarEstado: (id, estado) => axiosInstance.patch(`/citas/${id}/estado?estado=${estado}`)
}

export const pagosApi = {
  registrar: (data) => axiosInstance.post('/pagos', data),
  buscarPorCita: (citaId) => axiosInstance.get(`/pagos/cita/${citaId}`),
  ingresosDiarios: (fecha) => axiosInstance.get(`/pagos/reportes/diario?fecha=${fecha}`),
  ingresosMensuales: (anio, mes) => axiosInstance.get(`/pagos/reportes/mensual?anio=${anio}&mes=${mes}`)
}

export const publicApi = {
  listarServicios: () => axiosInstance.get('/servicios'),
  consultarDisponibilidad: (fecha, duracionMinutos) =>
    axiosInstance.get(`/public/disponibilidad?fecha=${fecha}&duracionMinutos=${duracionMinutos}`),
  crearCita: (data) => axiosInstance.post('/public/citas', data)
}