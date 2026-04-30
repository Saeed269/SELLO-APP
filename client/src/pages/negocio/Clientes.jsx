import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E8763A'

export default function Clientes() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalMensaje, setModalMensaje] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)

      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('user_id', user.id).single()
      if (!negocioData) { navigate('/negocio/onboarding'); return }
      setNegocio(negocioData)

      const { data: tarjetasData } = await supabase
        .from('tarjetas').select('*').eq('negocio_id', negocioData.id)

      if (!tarjetasData || tarjetasData.length === 0) {
        setClientes([])
        setLoading(false)
        return
      }

      const clienteIds = tarjetasData.map(t => t.cliente_id)
      const { data: clientesData } = await supabase
        .from('clientes').select('id, nombre, email').in('id', clienteIds)

      const clientesMap = {}
      clientesData?.forEach(c => { clientesMap[c.id] = c })
      setClientes(tarjetasData.map(t => ({ ...t, clientes: clientesMap[t.cliente_id] || null })))
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleAñadirSello = async (tarjeta) => {
    if (tarjeta.sellos_actuales >= negocio.num_sellos) return
    const nuevosSellos = (tarjeta.sellos_actuales || 0) + 1
    const { error } = await supabase
      .from('tarjetas').update({ sellos_actuales: nuevosSellos }).eq('id', tarjeta.id)
    if (!error) {
      setClientes(prev => prev.map(c =>
        c.id === tarjeta.id ? { ...c, sellos_actuales: nuevosSellos } : c
      ))
    }
  }

  const handleEnviarMensaje = async () => {
    if (!mensaje.trim() || !modalMensaje) return
    setEnviando(true)
    await supabase.from('tarjetas').update({ mensaje_negocio: mensaje.trim() }).eq('id', modalMensaje.id)
    setEnviando(false)
    setModalMensaje(null)
    setMensaje('')
  }

  const clientesFiltrados = clientes.filter(c =>
    c.clientes?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.clientes?.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
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
            <h1 style={s.titulo}>Clientes</h1>
            <p style={s.subtitulo}>Gestiona tus clientes, añade sellos o descuenta sesiones manualmente</p>
          </div>

          {/* Buscador */}
          <div style={s.searchCard}>
            <div style={s.searchWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={s.searchInput}
              />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0.5rem 0 0' }}>
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} encontrado{clientesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lista */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {clientesFiltrados.length === 0 ? (
              <div style={s.empty}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', display: 'block' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p style={{ color: '#6B7280', fontSize: '1.05rem', margin: 0 }}>
                  {busqueda ? `No se encontraron clientes con "${busqueda}"` : 'Aún no tienes clientes registrados'}
                </p>
              </div>
            ) : (
              clientesFiltrados.map(tarjeta => {
                const sellos = tarjeta.sellos_actuales || 0
                const maxSellos = negocio.num_sellos || 10
                const progreso = Math.min((sellos / maxSellos) * 100, 100)
                const premioGanado = sellos >= maxSellos
                const inicial = tarjeta.clientes?.nombre?.[0]?.toUpperCase() || '?'

                return (
                  <div key={tarjeta.id} style={s.card}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>

                        {/* Avatar + info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #E8763A, #c03a06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: '700', flexShrink: 0 }}>
                            {inicial}
                          </div>
                          <div>
                            <h3 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: '700', color: '#1C1C1E' }}>{tarjeta.clientes?.nombre || 'Sin nombre'}</h3>
                            <p style={{ margin: '0 0 2px', fontSize: '0.85rem', color: '#6B7280' }}>{tarjeta.clientes?.email}</p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                Desde {formatFecha(tarjeta.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tarjeta de sellos */}
                        <div style={{ background: premioGanado ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : 'linear-gradient(135deg, #FFF4EE, #FFE8D6)', borderRadius: '14px', padding: '1rem 1.25rem', minWidth: '180px', border: `2px solid ${premioGanado ? '#F59E0B' : NARANJA}33` }}>
                          <p style={{ margin: '0 0 4px', fontSize: '0.78rem', fontWeight: '600', color: premioGanado ? '#92400e' : NARANJA }}>
                            {premioGanado ? '🏆 Premio listo' : 'Tarjeta de Sellos'}
                          </p>
                          <p style={{ margin: '0 0 8px', fontSize: '2rem', fontWeight: '700', color: '#1C1C1E', lineHeight: 1 }}>
                            {sellos} <span style={{ fontSize: '1.1rem', color: '#9CA3AF', fontWeight: '400' }}>/ {maxSellos}</span>
                          </p>
                          <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progreso}%`, backgroundColor: premioGanado ? '#F59E0B' : NARANJA, borderRadius: '3px', transition: 'width 0.3s' }} />
                          </div>
                          {premioGanado && (
                            <p style={{ margin: '6px 0 0', fontSize: '0.72rem', fontWeight: '700', color: '#065F46', backgroundColor: '#D1FAE5', borderRadius: '6px', padding: '2px 6px', textAlign: 'center' }}>
                              ¡Premio disponible!
                            </p>
                          )}
                        </div>

                        {/* Acciones */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={() => handleAñadirSello(tarjeta)}
                            disabled={premioGanado}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '0.65rem 1.25rem',
                              backgroundColor: premioGanado ? '#E5E7EB' : NARANJA,
                              color: premioGanado ? '#9CA3AF' : '#fff',
                              border: 'none', borderRadius: '10px',
                              fontSize: '0.88rem', fontWeight: '700',
                              cursor: premioGanado ? 'not-allowed' : 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Añadir Sello
                          </button>
                          <button
                            onClick={() => { setModalMensaje(tarjeta); setMensaje('') }}
                            style={s.btnMensaje}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Enviar Mensaje
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      {/* Modal mensaje */}
      {modalMensaje && (
        <div style={s.overlay} onClick={() => { setModalMensaje(null); setMensaje('') }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: '700', color: '#1C1C1E' }}>
              Enviar Mensaje a {modalMensaje.clientes?.nombre}
            </h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: '#6B7280' }}>
              Este mensaje aparecerá en la tarjeta digital del cliente cuando la abra.
            </p>
            <textarea
              placeholder="Escribe tu mensaje u oferta especial..."
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              rows={4}
              style={s.textarea}
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '1.25rem' }}>
              <button onClick={() => { setModalMensaje(null); setMensaje('') }} style={s.btnCancelar}>Cancelar</button>
              <button
                onClick={handleEnviarMensaje}
                disabled={!mensaje.trim() || enviando}
                style={{ ...s.btnEnviar, opacity: !mensaje.trim() ? 0.5 : 1, cursor: !mensaje.trim() ? 'not-allowed' : 'pointer' }}
              >
                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#F9FAFB' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.5rem' },
  inner: { maxWidth: 960, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.8rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#6B7280' },
  searchCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #E5E7EB', borderRadius: '10px', padding: '0.75rem 1rem' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1C1C1E', backgroundColor: 'transparent' },
  empty: { backgroundColor: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' },
  btnMensaje: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '0.65rem 1.25rem', backgroundColor: '#F3F4F6',
    color: '#374151', border: 'none', borderRadius: '10px',
    fontSize: '0.88rem', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  textarea: { width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '2px solid #E5E7EB', fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#1C1C1E', boxSizing: 'border-box' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
  btnEnviar: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' },
}