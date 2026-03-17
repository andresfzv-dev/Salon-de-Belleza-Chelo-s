import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useCurrentUser, logout } from '../features/auth/hooks/useAuth'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Inicio', icon: '⊞' },
  { to: '/citas', label: 'Citas', icon: '◷' },
  { to: '/clientes', label: 'Clientes', icon: '◉' },
  { to: '/servicios', label: 'Servicios', icon: '✦' },
  { to: '/pagos', label: 'Pagos', icon: '◈' },
  { to: '/reportes', label: 'Reportes', icon: '▦' }
]

const AdminLayout = () => {
  const user = useCurrentUser()

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Chelo's</span>
          <span className={styles.brandSub}>Salón de Belleza</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.nombre}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>
            Salir
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout