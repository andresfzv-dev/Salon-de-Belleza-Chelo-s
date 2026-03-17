import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import CitasPage from '../pages/CitasPage'
import ClientesPage from '../pages/ClientesPage'
import ServiciosPage from '../pages/ServiciosPage'
import PagosPage from '../pages/PagosPage'
import ReportesPage from '../pages/ReportesPage'
import AdminLayout from '../layouts/AdminLayout'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="reportes" element={<ReportesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter