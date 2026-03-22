import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { publicApi } from '../../../api'

export const useServicios = () => {
  return useQuery({
    queryKey: ['servicios-publicos'],
    queryFn: () => publicApi.listarServicios().then(res => res.data)
  })
}

export const useDisponibilidad = (fecha, duracionMinutos) => {
  return useQuery({
    queryKey: ['disponibilidad', fecha, duracionMinutos],
    queryFn: () => publicApi.consultarDisponibilidad(fecha, duracionMinutos).then(res => res.data),
    enabled: !!fecha && !!duracionMinutos
  })
}

export const useCrearCitaPublica = () => {
  return useMutation({
    mutationFn: (data) => publicApi.crearCita(data),
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al crear la cita'
      toast.error(mensaje)
    }
  })
}