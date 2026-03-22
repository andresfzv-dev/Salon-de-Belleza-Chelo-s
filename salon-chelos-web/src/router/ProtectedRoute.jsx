import { Navigate } from 'react-router-dom'
import { TOKEN_KEY } from '../constants'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

export default ProtectedRoute