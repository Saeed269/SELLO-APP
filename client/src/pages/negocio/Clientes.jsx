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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #E8763A, #c03a06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: '700', flexShrink: 0 }}>
                      {inicial}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1C1C1E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tarjeta.clientes?.nombre || 'Sin nombre'}</p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tarjeta.clientes?.email}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF' }}>Desde {formatFecha(tarjeta.created_at)}</p>
                    </div>

                    {/* Sellos en texto */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '0.7rem', fontWeight: '600', color: premioGanado ? '#92400e' : '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {premioGanado ? '🏆 Premio' : 'Sellos'}
                      </p>
                      <p style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: '700', color: premioGanado ? '#F59E0B' : '#1C1C1E', lineHeight: 1 }}>
                        {sellos}<span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: '400' }}>/{maxSellos}</span>
                      </p>

                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleAñadirSello(tarjeta)}
                        disabled={premioGanado}
                        style={{ padding: '0.4rem 0.85rem', backgroundColor: premioGanado ? '#E5E7EB' : NARANJA, color: premioGanado ? '#9CA3AF' : '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: premioGanado ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                      >
                        + Añadir Sello
                      </button>
                      <button onClick={() => { setModalMensaje(tarjeta); setMensaje('') }} style={s.btnMensaje}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Mensaje
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
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', textAlign: 'left' },
  btnMensaje: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
    padding: '0.4rem 0.85rem', backgroundColor: '#F3F4F6',
    color: '#374151', border: 'none', borderRadius: '8px',
    fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  textarea: { width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '2px solid #E5E7EB', fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#1C1C1E', boxSizing: 'border-box' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
  btnEnviar: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' },
}