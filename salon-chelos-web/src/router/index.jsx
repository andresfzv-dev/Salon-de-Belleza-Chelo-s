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
import PublicBookingPage from '../pages/PublicBookingPage'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicBookingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin"
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter