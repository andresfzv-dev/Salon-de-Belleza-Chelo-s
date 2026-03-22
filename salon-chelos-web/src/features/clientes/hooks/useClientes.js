import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { clientesApi } from '../../../api'

const QUERY_KEY = ['clientes']

export const useClientes = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => clientesApi.listar().then(res => res.data)
  })
}

export const useBuscarClientePorTelefono = () => {
  return useMutation({
    mutationFn: (telefono) => clientesApi.buscarPorTelefono(telefono).then(res => res.data)
  })
}

export const useCrearCliente = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => clientesApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cliente registrado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al registrar el cliente'
      toast.error(mensaje)
    }
  })
}

export const useActualizarCliente = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => clientesApi.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cliente actualizado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al actualizar el cliente'
      toast.error(mensaje)
    }
  })
}

export const useEliminarCliente = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => clientesApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cliente eliminado correctamente')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al eliminar el cliente'
      toast.error(mensaje)
    }
  })
}