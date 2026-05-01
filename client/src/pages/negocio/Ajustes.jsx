import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E8763A'

export default function Ajustes() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [notificaciones, setNotificaciones] = useState(true)
  const [guardandoCuenta, setGuardandoCuenta] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [msgCuenta, setMsgCuenta] = useState(null)
  const [msgPassword, setMsgPassword] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [confirmTexto, setConfirmTexto] = useState('')
  const [eliminando, setEliminando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)
      setEmail(user.email || '')

      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('user_id', user.id).single()
      if (!negocioData) { navigate('/negocio/onboarding'); return }
      setNegocio(negocioData)
      setNombre(negocioData.nombre || '')
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleGuardarCuenta = async () => {
    setGuardandoCuenta(true)
    setMsgCuenta(null)

    const { error } = await supabase
      .from('negocios').update({ nombre }).eq('id', negocio.id)

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email })
      if (emailError) {
        setMsgCuenta({ tipo: 'error', texto: 'Error al actualizar el email: ' + emailError.message })
        setGuardandoCuenta(false)
        return
      }
    }

    setMsgCuenta(error
      ? { tipo: 'error', texto: 'Error al guardar: ' + error.message }
      : { tipo: 'ok', texto: 'Cambios guardados correctamente' }
    )
    setGuardandoCuenta(false)
  }

  const handleCambiarPassword = async () => {
    if (!passwordNuevo || passwordNuevo.length < 6) {
      setMsgPassword({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }
    setGuardandoPassword(true)
    setMsgPassword(null)

    const { error } = await supabase.auth.updateUser({ password: passwordNuevo })
    setMsgPassword(error
      ? { tipo: 'error', texto: 'Error al cambiar contraseña: ' + error.message }
      : { tipo: 'ok', texto: 'Contraseña actualizada correctamente' }
    )
    setPasswordActual('')
    setPasswordNuevo('')
    setGuardandoPassword(false)
  }

  const handleEliminarCuenta = async () => {
    if (confirmTexto !== 'ELIMINAR') return
    setEliminando(true)
    // Marcar negocio como pendiente de eliminar (en 30 días)
    await supabase.from('negocios').update({ pendiente_eliminar: true, fecha_eliminar: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }).eq('id', negocio.id)
    await supabase.auth.signOut()
    navigate('/negocio/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
    </div>
  )

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />

      <main style={s.main}>
        <div style={s.inner}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={s.titulo}>Ajustes</h1>
            <p style={s.subtitulo}>Gestiona tu cuenta y preferencias</p>
          </div>

          {/* Cuenta */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Cuenta</h2>

            <div style={s.field}>
              <label style={s.label}>Nombre del negocio</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} style={s.input} placeholder="Nombre del negocio" />
            </div>

            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} style={s.input} placeholder="tu@email.com" type="email" />
            </div>

            {msgCuenta && (
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: msgCuenta.tipo === 'ok' ? '#2D6A4F' : '#dc2626', backgroundColor: msgCuenta.tipo === 'ok' ? '#ECFDF5' : '#FEF2F2', padding: '0.6rem 1rem', borderRadius: '8px' }}>
                {msgCuenta.texto}
              </p>
            )}

            <button onClick={handleGuardarCuenta} disabled={guardandoCuenta} style={s.btnPrimary}>
              {guardandoCuenta ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

          {/* Contraseña */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Contraseña</h2>

            <div style={s.field}>
              <label style={s.label}>Nueva contraseña</label>
              <input value={passwordNuevo} onChange={e => setPasswordNuevo(e.target.value)} style={s.input} placeholder="Mínimo 6 caracteres" type="password" />
            </div>

            {msgPassword && (
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: msgPassword.tipo === 'ok' ? '#2D6A4F' : '#dc2626', backgroundColor: msgPassword.tipo === 'ok' ? '#ECFDF5' : '#FEF2F2', padding: '0.6rem 1rem', borderRadius: '8px' }}>
                {msgPassword.texto}
              </p>
            )}

            <button onClick={handleCambiarPassword} disabled={guardandoPassword} style={s.btnPrimary}>
              {guardandoPassword ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </div>

          {/* Notificaciones */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Notificaciones</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: '500', color: '#1C1C1E' }}>Avisos de actividad</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>Recibe notificaciones cuando un cliente canjee un premio</p>
              </div>
              <button
                onClick={() => setNotificaciones(!notificaciones)}
                style={{ width: 48, height: 28, borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: notificaciones ? NARANJA : '#E5E7EB', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 3, left: notificaciones ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>

          {/* Eliminar cuenta */}
          <div style={{ ...s.section, border: '1.5px solid #FEE2E2' }}>
            <h2 style={{ ...s.sectionTitle, color: '#dc2626' }}>Eliminar cuenta</h2>
            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
              Si eliminas tu cuenta, tendrás <strong>30 días</strong> para recuperarla contactando con soporte. Pasado ese tiempo, todos tus datos serán eliminados permanentemente.
            </p>
            <button onClick={() => setModalEliminar(true)} style={s.btnPeligro}>
              Eliminar mi cuenta
            </button>
          </div>

        </div>
      </main>

      {/* Modal eliminar cuenta */}
      {modalEliminar && (
        <div style={s.overlay} onClick={() => { setModalEliminar(false); setConfirmTexto('') }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: '700', color: '#dc2626' }}>¿Eliminar cuenta?</h2>
            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>
              Esta acción iniciará el proceso de eliminación. Tendrás <strong>30 días</strong> para cancelarlo contactando con soporte en <strong>soporte@sello.app</strong>.
            </p>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#1C1C1E', fontWeight: '500' }}>
              Escribe <strong>ELIMINAR</strong> para confirmar:
            </p>
            <input
              value={confirmTexto}
              onChange={e => setConfirmTexto(e.target.value)}
              placeholder="ELIMINAR"
              style={{ ...s.input, marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setModalEliminar(false); setConfirmTexto('') }} style={s.btnCancelar}>Cancelar</button>
              <button
                onClick={handleEliminarCuenta}
                disabled={confirmTexto !== 'ELIMINAR' || eliminando}
                style={{ ...s.btnPeligro, flex: 1, opacity: confirmTexto !== 'ELIMINAR' ? 0.4 : 1 }}
              >
                {eliminando ? 'Eliminando...' : 'Confirmar eliminación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 600, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  section: { backgroundColor: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: '700', color: '#1C1C1E' },
  field: { marginBottom: '0.85rem' },
  label: { display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', color: '#1C1C1E', boxSizing: 'border-box', fontFamily: 'inherit' },
  btnPrimary: { width: '100%', padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  btnPeligro: { width: '100%', padding: '0.85rem', backgroundColor: '#FEF2F2', color: '#dc2626', border: '1.5px solid #FCA5A5', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '460px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#f5f5f5', color: '#888', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
}