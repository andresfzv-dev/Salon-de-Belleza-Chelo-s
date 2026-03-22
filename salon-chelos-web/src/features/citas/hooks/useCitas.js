import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { citasApi } from '../../../api'

const QUERY_KEY = ['citas']

export const useCitas = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => citasApi.listar().then(res => res.data)
  })
}

export const useCrearCita = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => citasApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cita creada correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al crear la cita'
      toast.error(mensaje)
    }
  })
}

export const useActualizarCita = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => citasApi.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cita actualizada correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al actualizar la cita'
      toast.error(mensaje)
    }
  })
}

export const useCambiarEstadoCita = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }) => citasApi.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Estado actualizado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al cambiar el estado'
      toast.error(mensaje)
    }
  })
}