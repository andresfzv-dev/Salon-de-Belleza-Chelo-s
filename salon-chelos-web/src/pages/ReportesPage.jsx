import { useState } from 'react'
import dayjs from 'dayjs'
import { PageHeader } from '../components/ui'
import { useIngresosDiarios, useIngresosMensuales } from '../features/pagos/hooks/usePagos'
import styles from './ReportesPage.module.css'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const ReportesPage = () => {
  const hoy = dayjs()
  const [fechaDiaria, setFechaDiaria] = useState(hoy.format('YYYY-MM-DD'))
  const [anio, setAnio] = useState(hoy.year())
  const [mes, setMes] = useState(hoy.month() + 1)

  const fechaISO = `${fechaDiaria}T00:00:00`

  const { data: ingresosDiarios, isLoading: loadingDiario } = useIngresosDiarios(fechaISO)
  const { data: ingresosMensuales, isLoading: loadingMensual } = useIngresosMensuales(anio, mes)

  const formatCOP = (valor) =>
    `$${Number(valor || 0).toLocaleString('es-CO')}`

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Consulta los ingresos del salón"
      />

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Ingresos del día</h2>

          <div className={styles.field}>
            <label className={styles.label}>Selecciona una fecha</label>
            <input
              type="date"
              value={fechaDiaria}
              onChange={(e) => setFechaDiaria(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.resultado}>
            {loadingDiario ? (
              <span className={styles.loading}>Calculando...</span>
            ) : (
              <>
                <span className={styles.resultadoLabel}>Total del día</span>
                <span className={styles.resultadoValor}>
                  {formatCOP(ingresosDiarios)}
                </span>
                <span className={styles.resultadoFecha}>
                  {dayjs(fechaDiaria).format('DD [de] MMMM [de] YYYY')}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Ingresos del mes</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Mes</label>
              <select
                value={mes}
                onChange={(e) => setMes(Number(e.target.value))}
                className={styles.select}
              >
                {MESES.map((nombre, i) => (
                  <option key={i + 1} value={i + 1}>{nombre}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Año</label>
              <select
                value={anio}
                onChange={(e) => setAnio(Number(e.target.value))}
                className={styles.select}
              >
                {[hoy.year() - 1, hoy.year(), hoy.year() + 1].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.resultado}>
            {loadingMensual ? (
              <span className={styles.loading}>Calculando...</span>
            ) : (
              <>
                <span className={styles.resultadoLabel}>Total del mes</span>
                <span className={styles.resultadoValor}>
                  {formatCOP(ingresosMensuales)}
                </span>
                <span className={styles.resultadoFecha}>
                  {MESES[mes - 1]} {anio}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesPage