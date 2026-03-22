import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { pagosApi } from '../../../api'

const QUERY_KEY = ['pagos']

export const usePagoByCita = (citaId) => {
  return useQuery({
    queryKey: [...QUERY_KEY, citaId],
    queryFn: () => pagosApi.buscarPorCita(citaId).then(res => res.data),
    enabled: !!citaId,
    retry: false
  })
}

export const useRegistrarPago = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => pagosApi.registrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['citas'] })
      toast.success('Pago registrado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al registrar el pago'
      toast.error(mensaje)
    }
  })
}

export const useIngresosDiarios = (fecha) => {
  return useQuery({
    queryKey: [...QUERY_KEY, 'diario', fecha],
    queryFn: () => pagosApi.ingresosDiarios(fecha).then(res => res.data),
    enabled: !!fecha
  })
}

export const useIngresosMensuales = (anio, mes) => {
  return useQuery({
    queryKey: [...QUERY_KEY, 'mensual', anio, mes],
    queryFn: () => pagosApi.ingresosMensuales(anio, mes).then(res => res.data),
    enabled: !!anio && !!mes
  })
}