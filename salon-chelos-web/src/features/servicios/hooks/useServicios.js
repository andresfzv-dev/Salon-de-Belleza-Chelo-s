import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { serviciosApi } from '../../../api'

const QUERY_KEY = ['servicios']

export const useServicios = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => serviciosApi.listar().then(res => res.data)
  })
}

export const useCrearServicio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => serviciosApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Servicio creado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al crear el servicio'
      toast.error(mensaje)
    }
  })
}

export const useActualizarServicio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => serviciosApi.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Servicio actualizado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al actualizar el servicio'
      toast.error(mensaje)
    }
  })
}

export const useEliminarServicio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => serviciosApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Servicio eliminado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al eliminar el servicio'
      toast.error(mensaje)
    }
  })
}