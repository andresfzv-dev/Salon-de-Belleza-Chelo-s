import { useMemo } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { PageHeader } from '../components/ui'
import { useCitas } from '../features/citas/hooks/useCitas'
import { useClientes } from '../features/clientes/hooks/useClientes'
import { useServicios } from '../features/servicios/hooks/useServicios'
import { useIngresosDiarios } from '../features/pagos/hooks/usePagos'
import { ESTADO_CITA } from '../constants'
import styles from './DashboardPage.module.css'

dayjs.locale('es')

const StatCard = ({ label, valor, sub, color }) => (
  <div className={styles.statCard}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValor} style={{ color: color || 'var(--color-text-primary)' }}>
      {valor}
    </span>
    {sub && <span className={styles.statSub}>{sub}</span>}
  </div>
)

const DashboardPage = () => {
  const hoy = dayjs()
  const fechaISO = `${hoy.format('YYYY-MM-DD')}T00:00:00`

  const { data: citas } = useCitas()
  const { data: clientes } = useClientes()
  const { data: servicios } = useServicios()
  const { data: ingresosDiarios } = useIngresosDiarios(fechaISO)

  const stats = useMemo(() => {
    if (!citas) return {}

    const citasHoy = citas.filter(c => c.fecha === hoy.format('YYYY-MM-DD'))
    const pendientesHoy = citasHoy.filter(c => c.estado === ESTADO_CITA.PENDIENTE)
    const completadasHoy = citasHoy.filter(c => c.estado === ESTADO_CITA.COMPLETADA)
    const proximasSemana = citas.filter(c => {
      const fecha = dayjs(c.fecha)
      return fecha.isAfter(hoy) &&
        fecha.isBefore(hoy.add(7, 'day')) &&
        c.estado === ESTADO_CITA.PENDIENTE
    })

    return {
      citasHoy: citasHoy.length,
      pendientesHoy: pendientesHoy.length,
      completadasHoy: completadasHoy.length,
      proximasSemana: proximasSemana.length,
      totalClientes: clientes?.length || 0,
      totalServicios: servicios?.length || 0
    }
  }, [citas, clientes, servicios])

  const citasHoy = useMemo(() => {
    if (!citas) return []
    return citas
      .filter(c => c.fecha === hoy.format('YYYY-MM-DD'))
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
  }, [citas])

  const formatCOP = (valor) => `$${Number(valor || 0).toLocaleString('es-CO')}`

  return (
    <div>
      <PageHeader
        title={`Buen día ✦`}
        subtitle={hoy.format('dddd, D [de] MMMM [de] YYYY')}
      />

      <div className={styles.statsGrid}>
        <StatCard
          label="Citas hoy"
          valor={stats.citasHoy}
          sub={`${stats.pendientesHoy} pendientes · ${stats.completadasHoy} completadas`}
        />
        <StatCard
          label="Ingresos del día"
          valor={formatCOP(ingresosDiarios)}
          color="var(--color-pink)"
        />
        <StatCard
          label="Próximas 7 días"
          valor={stats.proximasSemana}
          sub="citas pendientes"
        />
        <StatCard
          label="Clientes registrados"
          valor={stats.totalClientes}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Agenda de hoy</h2>
        {citasHoy.length === 0 ? (
          <div className={styles.empty}>
            No hay citas programadas para hoy
          </div>
        ) : (
          <div className={styles.agendaList}>
            {citasHoy.map(cita => (
              <div
                key={cita.id}
                className={`${styles.agendaItem} ${styles[cita.estado.toLowerCase()]}`}
              >
                <div className={styles.agendaHora}>
                  {cita.horaInicio?.slice(0, 5)}
                </div>
                <div className={styles.agendaInfo}>
                  <span className={styles.agendaCliente}>{cita.clienteNombre}</span>
                  <span className={styles.agendaServicio}>{cita.servicioNombre}</span>
                </div>
                <div className={styles.agendaDuracion}>
                  {cita.duracionRealMinutos} min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage