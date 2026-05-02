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

function FieldInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <label style={s.label}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} style={s.input} placeholder={placeholder} type={type} />
    </div>
  )
}

function Row({ titulo, valor, onEdit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ textAlign: 'left', minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '0.92rem', fontWeight: '600', color: '#1C1C1E' }}>{titulo}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{valor || 'No especificado'}</p>
      </div>
      <button onClick={onEdit} style={s.btnSecondary}>Editar</button>
    </div>
  )
}

export default function Ajustes() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notificaciones, setNotificaciones] = useState(true)
  const [modalNombre, setModalNombre] = useState(false)
  const [modalEmail, setModalEmail] = useState(false)
  const [modalTelefono, setModalTelefono] = useState(false)
  const [modalDireccion, setModalDireccion] = useState(false)
  const [modalPassword, setModalPassword] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [confirmTexto, setConfirmTexto] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg] = useState(null)
  const [eliminando, setEliminando] = useState(false)

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
      setTelefono(negocioData.telefono || '')
      setDireccion(negocioData.direccion || '')
      setLoading(false)
    }
    init()
  }, [navigate])

  const cerrar = (setter) => { setter(false); setMsg(null) }

  const guardarNombre = async () => {
    setGuardando(true); setMsg(null)
    const { error } = await supabase.from('negocios').update({ nombre }).eq('id', negocio.id)
    if (error) { setMsg({ tipo: 'error', texto: error.message }) }
    else { setNegocio(prev => ({ ...prev, nombre })); setMsg({ tipo: 'ok', texto: 'Nombre actualizado' }); setTimeout(() => cerrar(setModalNombre), 1200) }
    setGuardando(false)
  }

  const guardarEmail = async () => {
    if (email !== emailConfirm) { setMsg({ tipo: 'error', texto: 'Los emails no coinciden' }); return }
    setGuardando(true); setMsg(null)
    const { error } = await supabase.auth.updateUser({ email })
    if (error) { setMsg({ tipo: 'error', texto: error.message }) }
    else { setMsg({ tipo: 'ok', texto: 'Email actualizado. Revisa tu bandeja de entrada.' }); setTimeout(() => cerrar(setModalEmail), 1500) }
    setGuardando(false)
  }

  const guardarTelefono = async () => {
    setGuardando(true); setMsg(null)
    const { error } = await supabase.from('negocios').update({ telefono }).eq('id', negocio.id)
    if (error) { setMsg({ tipo: 'error', texto: error.message }) }
    else { setNegocio(prev => ({ ...prev, telefono })); setMsg({ tipo: 'ok', texto: 'Teléfono actualizado' }); setTimeout(() => cerrar(setModalTelefono), 1200) }
    setGuardando(false)
  }

  const guardarDireccion = async () => {
    setGuardando(true); setMsg(null)
    const { error } = await supabase.from('negocios').update({ direccion }).eq('id', negocio.id)
    if (error) { setMsg({ tipo: 'error', texto: error.message }) }
    else { setNegocio(prev => ({ ...prev, direccion })); setMsg({ tipo: 'ok', texto: 'Dirección actualizada' }); setTimeout(() => cerrar(setModalDireccion), 1200) }
    setGuardando(false)
  }

  const guardarPassword = async () => {
    if (passwordNuevo.length < 6) { setMsg({ tipo: 'error', texto: 'Mínimo 6 caracteres' }); return }
    if (passwordNuevo !== passwordConfirm) { setMsg({ tipo: 'error', texto: 'Las contraseñas no coinciden' }); return }
    setGuardando(true); setMsg(null)
    const { error } = await supabase.auth.updateUser({ password: passwordNuevo })
    if (error) { setMsg({ tipo: 'error', texto: error.message }) }
    else { setMsg({ tipo: 'ok', texto: 'Contraseña actualizada' }); setPasswordActual(''); setPasswordNuevo(''); setPasswordConfirm(''); setTimeout(() => cerrar(setModalPassword), 1200) }
    setGuardando(false)
  }

  const handleEliminar = async () => {
    if (confirmTexto !== 'ELIMINAR') return
    setEliminando(true)
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

          <div style={s.card}>
            <p style={s.cardTitle}>Información de la cuenta</p>
            <Row titulo="Nombre del negocio" valor={negocio?.nombre} onEdit={() => { setNombre(negocio?.nombre || ''); setModalNombre(true) }} />
            <Row titulo="Email" valor={user?.email} onEdit={() => { setEmail(user?.email || ''); setEmailConfirm(user?.email || ''); setModalEmail(true) }} />
            <Row titulo="Teléfono" valor={negocio?.telefono} onEdit={() => { setTelefono(negocio?.telefono || ''); setModalTelefono(true) }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 0' }}>
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.92rem', fontWeight: '600', color: '#1C1C1E' }}>Dirección</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{negocio?.direccion || 'No especificada'}</p>
              </div>
              <button onClick={() => { setDireccion(negocio?.direccion || ''); setModalDireccion(true) }} style={s.btnSecondary}>Editar</button>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}>Seguridad</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 0' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.92rem', fontWeight: '600', color: '#1C1C1E' }}>Contraseña</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Actualiza tu contraseña de acceso</p>
              </div>
              <button onClick={() => { setPasswordActual(''); setPasswordNuevo(''); setPasswordConfirm(''); setModalPassword(true) }} style={s.btnSecondary}>Cambiar</button>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}>Preferencias</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 0' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: '600', color: '#1C1C1E', textAlign: 'left' }}>Notificaciones</p>
              <button onClick={() => setNotificaciones(!notificaciones)} style={{ width: 48, height: 28, borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: notificaciones ? NARANJA : '#E5E7EB', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 3, left: notificaciones ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}>Plan y facturación</p>
            <div style={{ padding: '0.85rem 0', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan actual</p>
              <p style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: '700', color: '#1C1C1E' }}>✦ Básico</p>
              <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#9CA3AF' }}>Próxima renovación: 1 junio 2026</p>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', color: NARANJA }}>€12,99/mes</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 0' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Método de pago</p>
                <p style={{ margin: '0 0 2px', fontSize: '0.92rem', fontWeight: '600', color: '#1C1C1E' }}>VISA •••• •••• •••• 4821</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Expira 09/28</p>
              </div>
              <button style={s.btnSecondary}>Cambiar</button>
            </div>
          </div>

          <div style={{ ...s.card, border: '1.5px solid #FEE2E2' }}>
            <p style={{ ...s.cardTitle, color: '#dc2626' }}>Eliminar cuenta</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.85rem 0' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#9CA3AF', textAlign: 'left' }}>Tienes 30 días para recuperarla después de eliminarla</p>
              <button onClick={() => setModalEliminar(true)} style={s.btnPeligro}>Eliminar</button>
            </div>
          </div>
        </div>
      </main>

      {modalNombre && (
        <Modal titulo="Nombre del negocio" onClose={() => cerrar(setModalNombre)}>
          <FieldInput label="Nombre del negocio" value={nombre} onChange={setNombre} placeholder="Nombre del negocio" />
          {msg && <MsgFeedback msg={msg} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => cerrar(setModalNombre)} style={s.btnCancelar}>Cancelar</button>
            <button onClick={guardarNombre} disabled={guardando} style={s.btnPrimary}>{guardando ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </Modal>
      )}

      {modalEmail && (
        <Modal titulo="Email" onClose={() => cerrar(setModalEmail)}>
          <div style={{ marginBottom: '0.85rem', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#f9f9f9', border: '1.5px solid #e8e8e8' }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.72rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email actual</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1C1C1E' }}>{user?.email}</p>
          </div>
          <FieldInput label="Nuevo email" value={email} onChange={setEmail} placeholder="nuevo@email.com" type="email" />
          <FieldInput label="Confirmar nuevo email" value={emailConfirm} onChange={setEmailConfirm} placeholder="Confirma tu nuevo email" type="email" />
          {msg && <MsgFeedback msg={msg} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => cerrar(setModalEmail)} style={s.btnCancelar}>Cancelar</button>
            <button onClick={guardarEmail} disabled={guardando} style={s.btnPrimary}>{guardando ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </Modal>
      )}

      {modalTelefono && (
        <Modal titulo="Teléfono" onClose={() => cerrar(setModalTelefono)}>
          <FieldInput label="Teléfono" value={telefono} onChange={setTelefono} placeholder="+34 600 000 000" type="tel" />
          {msg && <MsgFeedback msg={msg} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => cerrar(setModalTelefono)} style={s.btnCancelar}>Cancelar</button>
            <button onClick={guardarTelefono} disabled={guardando} style={s.btnPrimary}>{guardando ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </Modal>
      )}

      {modalDireccion && (
        <Modal titulo="Dirección" onClose={() => cerrar(setModalDireccion)}>
          <FieldInput label="Dirección" value={direccion} onChange={setDireccion} placeholder="Calle, número, ciudad" />
          {msg && <MsgFeedback msg={msg} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => cerrar(setModalDireccion)} style={s.btnCancelar}>Cancelar</button>
            <button onClick={guardarDireccion} disabled={guardando} style={s.btnPrimary}>{guardando ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </Modal>
      )}

      {modalPassword && (
        <Modal titulo="Cambiar contraseña" onClose={() => cerrar(setModalPassword)}>
          <FieldInput label="Contraseña actual" value={passwordActual} onChange={setPasswordActual} placeholder="Tu contraseña actual" type="password" />
          <FieldInput label="Nueva contraseña" value={passwordNuevo} onChange={setPasswordNuevo} placeholder="Mínimo 6 caracteres" type="password" />
          <FieldInput label="Confirmar nueva contraseña" value={passwordConfirm} onChange={setPasswordConfirm} placeholder="Repite la nueva contraseña" type="password" />
          {msg && <MsgFeedback msg={msg} />}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => cerrar(setModalPassword)} style={s.btnCancelar}>Cancelar</button>
            <button onClick={guardarPassword} disabled={guardando} style={s.btnPrimary}>{guardando ? 'Actualizando...' : 'Cambiar'}</button>
          </div>
        </Modal>
      )}

      {modalEliminar && (
        <Modal titulo="Eliminar cuenta" onClose={() => { setModalEliminar(false); setConfirmTexto('') }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>
            Tendrás <strong>30 días</strong> para cancelarlo contactando en <strong>soporte@sello.app</strong>. Pasado ese tiempo todos tus datos se eliminarán permanentemente.
          </p>
          <FieldInput label="Escribe ELIMINAR para confirmar" value={confirmTexto} onChange={setConfirmTexto} placeholder="ELIMINAR" />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setModalEliminar(false); setConfirmTexto('') }} style={s.btnCancelar}>Cancelar</button>
            <button onClick={handleEliminar} disabled={confirmTexto !== 'ELIMINAR' || eliminando} style={{ ...s.btnEliminar, opacity: confirmTexto !== 'ELIMINAR' ? 0.4 : 1 }}>
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
  label: { display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', color: '#1C1C1E', boxSizing: 'border-box', fontFamily: 'inherit' },
  btnPrimary: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  btnSecondary: { padding: '0.45rem 1rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', flexShrink: 0 },
  btnPeligro: { padding: '0.45rem 1rem', backgroundColor: '#FEF2F2', color: '#dc2626', border: '1.5px solid #FCA5A5', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', flexShrink: 0 },
  btnEliminar: { flex: 1, padding: '0.85rem', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#f5f5f5', color: '#888', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '440px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', maxHeight: '90dvh', overflowY: 'auto' },
}