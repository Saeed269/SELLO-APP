import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E8763A'

function Modal({ titulo, onClose, children }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1C1C1E' }}>{titulo}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function MsgFeedback({ msg }) {
  return (
    <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: msg.tipo === 'ok' ? '#2D6A4F' : '#dc2626', backgroundColor: msg.tipo === 'ok' ? '#ECFDF5' : '#FEF2F2', padding: '0.6rem 1rem', borderRadius: '8px' }}>
      {msg.texto}
    </p>
  )
}

function SettingRow({ titulo, descripcion, accion, onAccion, peligro }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ textAlign: 'left' }}>
        <p style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: '600', color: peligro ? '#dc2626' : '#1C1C1E' }}>{titulo}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>{descripcion}</p>
      </div>
      {onAccion && (
        <button onClick={onAccion} style={peligro ? s.btnPeligro : s.btnSecondary}>{accion}</button>
      )}
    </div>
  )
}

export default function Ajustes() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notificaciones, setNotificaciones] = useState(true)
  const [modalCuenta, setModalCuenta] = useState(false)
  const [modalPassword, setModalPassword] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [guardandoCuenta, setGuardandoCuenta] = useState(false)
  const [msgCuenta, setMsgCuenta] = useState(null)
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [msgPassword, setMsgPassword] = useState(null)
  const [confirmTexto, setConfirmTexto] = useState('')
  const [eliminando, setEliminando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)
      setEmail(user.email || '')
      setEmailConfirm(user.email || '')
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
    if (email !== emailConfirm) {
      setMsgCuenta({ tipo: 'error', texto: 'Los emails no coinciden' })
      return
    }
    setGuardandoCuenta(true)
    setMsgCuenta(null)
    const { error } = await supabase.from('negocios').update({ nombre }).eq('id', negocio.id)
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email })
      if (emailError) {
        setMsgCuenta({ tipo: 'error', texto: emailError.message })
        setGuardandoCuenta(false)
        return
      }
    }
    if (error) {
      setMsgCuenta({ tipo: 'error', texto: error.message })
    } else {
      setNegocio(prev => ({ ...prev, nombre }))
      setMsgCuenta({ tipo: 'ok', texto: 'Cambios guardados correctamente' })
      setTimeout(() => { setModalCuenta(false); setMsgCuenta(null) }, 1500)
    }
    setGuardandoCuenta(false)
  }

  const handleCambiarPassword = async () => {
    if (passwordNuevo.length < 6) {
      setMsgPassword({ tipo: 'error', texto: 'Mínimo 6 caracteres' })
      return
    }
    if (passwordNuevo !== passwordConfirm) {
      setMsgPassword({ tipo: 'error', texto: 'Las contraseñas no coinciden' })
      return
    }
    setGuardandoPassword(true)
    setMsgPassword(null)
    const { error } = await supabase.auth.updateUser({ password: passwordNuevo })
    if (error) {
      setMsgPassword({ tipo: 'error', texto: error.message })
    } else {
      setMsgPassword({ tipo: 'ok', texto: 'Contraseña actualizada correctamente' })
      setPasswordNuevo('')
      setPasswordConfirm('')
      setTimeout(() => { setModalPassword(false); setMsgPassword(null) }, 1500)
    }
    setGuardandoPassword(false)
  }

  const handleEliminarCuenta = async () => {
    if (confirmTexto !== 'ELIMINAR') return
    setEliminando(true)
    await supabase.from('negocios').update({
      pendiente_eliminar: true,
      fecha_eliminar: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('id', negocio.id)
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

          {/* Sección cuenta */}
          <div style={s.card}>
            <p style={s.cardTitle}>Cuenta</p>
            <SettingRow titulo="Nombre del negocio y correo" descripcion="Actualiza el nombre de tu negocio o tu email de acceso" accion="Editar" onAccion={() => setModalCuenta(true)} />
            <SettingRow titulo="Contraseña" descripcion="Cambia tu contraseña de acceso" accion="Cambiar" onAccion={() => setModalPassword(true)} />
          </div>

          {/* Notificaciones */}
          <div style={s.card}>
            <p style={s.cardTitle}>Preferencias</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: '600', color: '#1C1C1E' }}>Notificaciones</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>Avisos cuando un cliente canjee un premio</p>
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
          <div style={{ ...s.card, border: '1.5px solid #FEE2E2' }}>
            <p style={{ ...s.cardTitle, color: '#dc2626' }}>Zona de peligro</p>
            <SettingRow titulo="Eliminar cuenta" descripcion="Tienes 30 días para recuperarla después de eliminarla" accion="Eliminar" onAccion={() => setModalEliminar(true)} peligro />
          </div>

        </div>
      </main>

      {/* Modal cuenta */}
      {modalCuenta && (
        <Modal titulo="Editar cuenta" onClose={() => { setModalCuenta(false); setMsgCuenta(null) }}>
          <div style={s.field}>
            <label style={s.label}>Nombre del negocio</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} style={s.input} placeholder="Nombre del negocio" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Correo electrónico</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={s.input} placeholder="tu@email.com" type="email" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirmar correo</label>
            <input value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} style={s.input} placeholder="Confirma tu email" type="email" />
          </div>
          {msgCuenta && <MsgFeedback msg={msgCuenta} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setModalCuenta(false); setMsgCuenta(null) }} style={s.btnCancelar}>Cancelar</button>
            <button onClick={handleGuardarCuenta} disabled={guardandoCuenta} style={s.btnPrimary}>
              {guardandoCuenta ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal contraseña */}
      {modalPassword && (
        <Modal titulo="Cambiar contraseña" onClose={() => { setModalPassword(false); setMsgPassword(null); setPasswordNuevo(''); setPasswordConfirm('') }}>
          <div style={s.field}>
            <label style={s.label}>Nueva contraseña</label>
            <input value={passwordNuevo} onChange={e => setPasswordNuevo(e.target.value)} style={s.input} placeholder="Mínimo 6 caracteres" type="password" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirmar contraseña</label>
            <input value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} style={s.input} placeholder="Repite la contraseña" type="password" />
          </div>
          {msgPassword && <MsgFeedback msg={msgPassword} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setModalPassword(false); setMsgPassword(null); setPasswordNuevo(''); setPasswordConfirm('') }} style={s.btnCancelar}>Cancelar</button>
            <button onClick={handleCambiarPassword} disabled={guardandoPassword} style={s.btnPrimary}>
              {guardandoPassword ? 'Actualizando...' : 'Cambiar'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal eliminar */}
      {modalEliminar && (
        <Modal titulo="Eliminar cuenta" onClose={() => { setModalEliminar(false); setConfirmTexto('') }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>
            Tendrás <strong>30 días</strong> para cancelarlo contactando en <strong>soporte@sello.app</strong>. Pasado ese tiempo todos tus datos se eliminarán permanentemente.
          </p>
          <div style={s.field}>
            <label style={s.label}>Escribe ELIMINAR para confirmar</label>
            <input value={confirmTexto} onChange={e => setConfirmTexto(e.target.value)} style={s.input} placeholder="ELIMINAR" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setModalEliminar(false); setConfirmTexto('') }} style={s.btnCancelar}>Cancelar</button>
            <button onClick={handleEliminarCuenta} disabled={confirmTexto !== 'ELIMINAR' || eliminando}
              style={{ ...s.btnEliminar, opacity: confirmTexto !== 'ELIMINAR' ? 0.4 : 1 }}>
              {eliminando ? 'Eliminando...' : 'Confirmar'}
            </button>
          </div>
        </Modal>
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
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '0 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '10px' },
  cardTitle: { margin: 0, fontSize: '0.72rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: '1rem', textAlign: 'left' },
  field: { marginBottom: '0.85rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', color: '#1C1C1E', boxSizing: 'border-box', fontFamily: 'inherit' },
  btnPrimary: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  btnSecondary: { padding: '0.45rem 1rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', flexShrink: 0 },
  btnPeligro: { padding: '0.45rem 1rem', backgroundColor: '#FEF2F2', color: '#dc2626', border: '1.5px solid #FCA5A5', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', flexShrink: 0 },
  btnEliminar: { flex: 1, padding: '0.85rem', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#f5f5f5', color: '#888', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '440px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
}