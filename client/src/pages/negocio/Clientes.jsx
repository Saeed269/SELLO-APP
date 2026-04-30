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
            <p style={s.subtitulo}>Gestiona tus clientes y añade sellos manualmente</p>
          </div>

          {/* Buscador */}
          <div style={s.searchWrap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={s.searchInput}
            />
          </div>
          <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 1rem' }}>{clientesFiltrados.length} clientes encontrados</p>

          {clientesFiltrados.length === 0 ? (
            <div style={s.empty}>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                {busqueda ? 'No se encontraron clientes' : 'Aún no tienes clientes registrados'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clientesFiltrados.map(tarjeta => {
                const progreso = Math.min((tarjeta.sellos_actuales / negocio.num_sellos) * 100, 100)
                const premioGanado = tarjeta.sellos_actuales >= negocio.num_sellos
                const inicial = tarjeta.clientes?.nombre?.[0]?.toUpperCase() || '?'

                return (
                  <div key={tarjeta.id} style={s.card}>

                    {/* Avatar */}
                    <div style={{ ...s.avatar, flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>{inicial}</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: '700', color: '#1C1C1E' }}>
                        {tarjeta.clientes?.nombre || 'Sin nombre'}
                      </p>
                      <p style={{ margin: '0 0 2px', fontSize: '0.82rem', color: '#666' }}>{tarjeta.clientes?.email}</p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>Desde {formatFecha(tarjeta.created_at)}</span>
                      </div>
                    </div>

                    {/* Contador sellos */}
                    <div style={{
                      backgroundColor: premioGanado ? '#FEF3C7' : '#F3F4F6',
                      borderRadius: '12px',
                      padding: '0.75rem 1.25rem',
                      minWidth: '140px',
                      flexShrink: 0,
                    }}>
                      <p style={{ margin: '0 0 2px', fontSize: '0.72rem', fontWeight: '600', color: premioGanado ? '#92400e' : NARANJA }}>
                        {premioGanado ? '🏆 Premio listo' : 'Tarjeta de Sellos'}
                      </p>
                      <p style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E', lineHeight: 1 }}>
                        {tarjeta.sellos_actuales} <span style={{ fontSize: '1rem', color: '#999', fontWeight: '400' }}>/ {negocio.num_sellos}</span>
                      </p>
                      <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progreso}%`, backgroundColor: premioGanado ? '#F59E0B' : NARANJA, borderRadius: '2px', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleAñadirSello(tarjeta)}
                        disabled={premioGanado}
                        style={{
                          padding: '0.6rem 1.25rem',
                          backgroundColor: premioGanado ? '#E5E7EB' : NARANJA,
                          color: premioGanado ? '#999' : '#fff',
                          border: 'none', borderRadius: '10px',
                          fontSize: '0.85rem', fontWeight: '700',
                          cursor: premioGanado ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        + Añadir Sello
                      </button>
                      <button
                        onClick={() => { setModalMensaje(tarjeta); setMensaje('') }}
                        style={s.btnMensaje}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Enviar Mensaje
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal mensaje */}
      {modalMensaje && (
        <div style={s.overlay} onClick={() => setModalMensaje(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: '700', color: '#1C1C1E' }}>
              Enviar Mensaje a {modalMensaje.clientes?.nombre}
            </h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#888' }}>
              Este mensaje aparecerá en la tarjeta digital del cliente cuando la abra.
            </p>
            <textarea
              placeholder="Escribe tu mensaje u oferta especial..."
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              rows={5}
              style={s.textarea}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button onClick={() => setModalMensaje(null)} style={s.btnCancelar}>Cancelar</button>
              <button
                onClick={handleEnviarMensaje}
                disabled={!mensaje.trim() || enviando}
                style={{ ...s.btnEnviar, opacity: !mensaje.trim() ? 0.5 : 1 }}
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
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 960, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
    backgroundColor: '#fff', borderRadius: '12px', padding: '0.85rem 1rem',
    border: '1.5px solid #e8e8e8', marginBottom: '0.5rem',
  },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1C1C1E', backgroundColor: 'transparent' },
  empty: { backgroundColor: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1.5px solid #e8e8e8' },
  card: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    backgroundColor: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
    border: '1px solid #E5E7EB', flexWrap: 'wrap',
  },
  avatar: {
    width: 50, height: 50, borderRadius: '50%',
    backgroundColor: NARANJA,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  btnMensaje: {
    padding: '0.6rem 1.25rem', backgroundColor: '#fff', color: '#555',
    border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.85rem',
    fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '6px', whiteSpace: 'nowrap',
  },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  textarea: { width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: '#1C1C1E', boxSizing: 'border-box' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#f5f5f5', color: '#888', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  btnEnviar: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
}