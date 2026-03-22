import { useState } from 'react'
import dayjs from 'dayjs'
import { useServicios, useDisponibilidad, useCrearCitaPublica } from '../features/public/hooks/usePublicBooking'
import styles from './PublicBookingPage.module.css'

const PASOS = ['Servicio', 'Fecha y hora', 'Tus datos', 'Confirmación']

const PublicBookingPage = () => {
  const [paso, setPaso] = useState(0)
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horaSeleccionada, setHoraSeleccionada] = useState(null)
  const [citaCreada, setCitaCreada] = useState(null)
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '' })
  const [errors, setErrors] = useState({})

  const { data: servicios, isLoading: loadingServicios } = useServicios()
  const { data: disponibilidad, isLoading: loadingDisponibilidad } = useDisponibilidad(
    fechaSeleccionada,
    servicioSeleccionado?.duracionMinMinutos
  )
  const crearCita = useCrearCitaPublica()

  const handleSeleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio)
    setFechaSeleccionada('')
    setHoraSeleccionada(null)
    setPaso(1)
  }

  const handleSeleccionarHora = (hora) => {
    setHoraSeleccionada(hora)
    setPaso(2)
  }

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!form.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El correo no es válido'
    }
    return newErrors
  }

  const handleConfirmar = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    crearCita.mutate({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim() || null,
      servicioId: servicioSeleccionado.id,
      fecha: fechaSeleccionada,
      horaInicio: horaSeleccionada + ':00',
      duracionRealMinutos: servicioSeleccionado.duracionMinMinutos
    }, {
      onSuccess: ({ data }) => {
        setCitaCreada(data)
        setPaso(3)
      }
    })
  }

  const hoyISO = dayjs().format('YYYY-MM-DD')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.brand}>Chelo's</h1>
        <p className={styles.brandSub}>Salón de Belleza</p>
      </header>

      <div className={styles.container}>
        {paso < 3 && (
          <div className={styles.pasos}>
            {PASOS.slice(0, 3).map((label, i) => (
              <div
                key={i}
                className={`${styles.paso} ${i === paso ? styles.pasoActivo : ''} ${i < paso ? styles.pasoDone : ''}`}
              >
                <div className={styles.pasoNum}>{i < paso ? '✓' : i + 1}</div>
                <span className={styles.pasoLabel}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {paso === 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>¿Qué servicio deseas?</h2>
            {loadingServicios ? (
              <div className={styles.loading}>Cargando servicios...</div>
            ) : (
              <div className={styles.serviciosGrid}>
                {servicios?.map(servicio => (
                  <button
                    key={servicio.id}
                    className={styles.servicioCard}
                    onClick={() => handleSeleccionarServicio(servicio)}
                  >
                    <span className={styles.servicioNombre}>{servicio.nombre}</span>
                    <span className={styles.servicioPrecio}>
                      ${servicio.precio.toLocaleString('es-CO')}
                    </span>
                    <span className={styles.servicioDuracion}>
                      {servicio.duracionMinMinutos === servicio.duracionMaxMinutos
                        ? `${servicio.duracionMinMinutos} min`
                        : `${servicio.duracionMinMinutos}-${servicio.duracionMaxMinutos} min`
                      }
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {paso === 1 && (
          <div className={styles.section}>
            <button className={styles.backBtn} onClick={() => setPaso(0)}>
              ← Volver
            </button>
            <h2 className={styles.sectionTitle}>Elige fecha y hora</h2>
            <p className={styles.servicioResumen}>
              {servicioSeleccionado?.nombre} · ${servicioSeleccionado?.precio.toLocaleString('es-CO')}
            </p>

            <div className={styles.field}>
              <label className={styles.label}>Fecha</label>
              <input
                type="date"
                min={hoyISO}
                value={fechaSeleccionada}
                onChange={(e) => {
                  setFechaSeleccionada(e.target.value)
                  setHoraSeleccionada(null)
                }}
                className={styles.dateInput}
              />
            </div>

            {fechaSeleccionada && (
              <div className={styles.field}>
                <label className={styles.label}>Hora disponible</label>
                {loadingDisponibilidad ? (
                  <div className={styles.loading}>Consultando disponibilidad...</div>
                ) : disponibilidad?.horasDisponibles?.length === 0 ? (
                  <div className={styles.sinHoras}>
                    No hay horas disponibles para esta fecha. Intenta con otro día.
                  </div>
                ) : (
                  <div className={styles.horasGrid}>
                    {disponibilidad?.horasDisponibles?.map(hora => (
                      <button
                        key={hora}
                        className={`${styles.horaBtn} ${horaSeleccionada === hora.slice(0, 5) ? styles.horaSelected : ''}`}
                        onClick={() => handleSeleccionarHora(hora.slice(0, 5))}
                      >
                        {hora.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {horaSeleccionada && (
              <button className={styles.btnPrimary} onClick={() => setPaso(2)}>
                Continuar →
              </button>
            )}
          </div>
        )}

        {paso === 2 && (
          <div className={styles.section}>
            <button className={styles.backBtn} onClick={() => setPaso(1)}>
              ← Volver
            </button>
            <h2 className={styles.sectionTitle}>Tus datos</h2>

            <div className={styles.resumenCita}>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Servicio</span>
                <span className={styles.resumenValor}>{servicioSeleccionado?.nombre}</span>
              </div>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Fecha</span>
                <span className={styles.resumenValor}>
                  {dayjs(fechaSeleccionada).format('DD [de] MMMM [de] YYYY')}
                </span>
              </div>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Hora</span>
                <span className={styles.resumenValor}>{horaSeleccionada}</span>
              </div>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Precio</span>
                <span className={styles.resumenValor}>
                  ${servicioSeleccionado?.precio.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Nombre completo <span className={styles.required}>*</span>
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChangeForm}
                  placeholder="Tu nombre"
                  className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                />
                {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Teléfono <span className={styles.required}>*</span>
                </label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChangeForm}
                  placeholder="Tu número de celular"
                  className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`}
                />
                {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Correo electrónico</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChangeForm}
                  placeholder="Para recibir recordatorio (opcional)"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
            </div>

            <button
              className={styles.btnPrimary}
              onClick={handleConfirmar}
              disabled={crearCita.isPending}
            >
              {crearCita.isPending ? 'Agendando...' : 'Confirmar cita'}
            </button>
          </div>
        )}

        {paso === 3 && citaCreada && (
          <div className={styles.confirmacion}>
            <div className={styles.confirmIcon}>✓</div>
            <h2 className={styles.confirmTitle}>¡Cita agendada!</h2>
            <p className={styles.confirmSub}>
              Te esperamos en el Salón Chelo's
            </p>

            <div className={styles.resumenCita}>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Servicio</span>
                <span className={styles.resumenValor}>{citaCreada.servicioNombre}</span>
              </div>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Fecha</span>
                <span className={styles.resumenValor}>
                  {dayjs(citaCreada.fecha).format('DD [de] MMMM [de] YYYY')}
                </span>
              </div>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Hora</span>
                <span className={styles.resumenValor}>{citaCreada.horaInicio?.slice(0, 5)}</span>
              </div>
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Cliente</span>
                <span className={styles.resumenValor}>{citaCreada.clienteNombre}</span>
              </div>
            </div>

            <button
              className={styles.btnSecondary}
              onClick={() => {
                setPaso(0)
                setServicioSeleccionado(null)
                setFechaSeleccionada('')
                setHoraSeleccionada(null)
                setCitaCreada(null)
                setForm({ nombre: '', telefono: '', email: '' })
              }}
            >
              Agendar otra cita
            </button>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Salón de Belleza Chelo's · Armenia, Quindío</p>
        <a href="/admin/login" className={styles.adminLink}>Acceso administrativo</a>
      </footer>

    </div>
  )
}

export default PublicBookingPage