import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../../api'
import { TOKEN_KEY, USER_KEY } from '../../../constants'

export const useAuth = () => {
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: ({ data }) => {
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify({
        nombre: data.nombre,
        email: data.email
      }))
      toast.success(`Bienvenida, ${data.nombre}`)
      navigate('/admin/dashboard')
    },
    onError: (error) => {
      const mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión'
      toast.error(mensaje)
    }
  })

  return { login }
}

export const useCurrentUser = () => {
  const [user] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  return user
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.location.href = '/admin/login'
}