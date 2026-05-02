import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { useNegocio } from '../../context/useNegocio'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E65100'

export default function Clientes() {
  const { user, negocio } = useNegocio()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalMensaje, setModalMensaje] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      if (!negocio) return

      const { data: tarjetasData } = await supabase
        .from('tarjetas').select('*').eq('negocio_id', negocio.id)

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
  }, [navigate, negocio])

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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #bf360c 0%, #E65100 60%, #d4380a 100%)' }}>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
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
            <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '0.5rem 0 0' }}>
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} encontrado{clientesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lista */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clientesFiltrados.length === 0 ? (
              <div style={s.empty}>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>
                  {busqueda ? `No se encontraron clientes con "${busqueda}"` : 'Aún no tienes clientes registrados'}
                </p>
              </div>
            ) : (
              clientesFiltrados.map(tarjeta => {
                const sellos = tarjeta.sellos_actuales || 0
                const maxSellos = negocio.num_sellos || 10
                const premioGanado = sellos >= maxSellos

                return (
                  <div key={tarjeta.id} style={s.card}>
                    {/* Info + sellos + botones en una fila */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

                      {/* Nombre / email / fecha */}
                      <div style={{ flex: 1, minWidth: '140px', textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1C1C1E' }}>
                          {tarjeta.clientes?.nombre || 'Sin nombre'}
                          {premioGanado && <span style={{ marginLeft: '6px', fontSize: '0.7rem', fontWeight: '600', color: '#92400e', backgroundColor: '#FEF3C7', borderRadius: '20px', padding: '1px 7px' }}>🏆 Premio</span>}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>{tarjeta.clientes?.email}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF' }}>Desde {formatFecha(tarjeta.created_at)}</p>
                      </div>

                      {/* Sellos */}
                      <div style={{ textAlign: 'right', flexShrink: 0, marginRight: '0.5rem' }}>
                        <p style={{ margin: '0 0 1px', fontSize: '0.68rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sellos</p>
                        <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: premioGanado ? '#F59E0B' : '#1C1C1E', lineHeight: 1 }}>
                          {sellos}<span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '400' }}>/{maxSellos}</span>
                        </p>
                      </div>

                      {/* Botones */}
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleAñadirSello(tarjeta)}
                          disabled={premioGanado}
                          style={{
                            padding: '0.4rem 0.75rem',
                            backgroundColor: premioGanado ? '#E5E7EB' : NARANJA,
                            color: premioGanado ? '#9CA3AF' : '#fff',
                            border: 'none', borderRadius: '8px',
                            fontSize: '0.78rem', fontWeight: '700',
                            cursor: premioGanado ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          + Sello
                        </button>
                        <button
                          onClick={() => { setModalMensaje(tarjeta); setMensaje('') }}
                          style={{
                            padding: '0.4rem 0.75rem',
                            backgroundColor: '#F3F4F6',
                            color: '#374151',
                            border: 'none', borderRadius: '8px',
                            fontSize: '0.78rem', fontWeight: '500',
                            cursor: 'pointer', whiteSpace: 'nowrap',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          Mensaje
                        </button>
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
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: '700', color: '#1C1C1E' }}>
              Enviar Mensaje a {modalMensaje.clientes?.nombre}
            </h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.88rem', color: '#6B7280' }}>
              Este mensaje aparecerá en la tarjeta digital del cliente cuando la abra.
            </p>
            <textarea
              placeholder="Escribe tu mensaje u oferta especial..."
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              rows={4}
              style={s.textarea}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button onClick={() => { setModalMensaje(null); setMensaje('') }} style={s.btnCancelar}>Cancelar</button>
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
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#F9FAFB' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 900, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#6B7280' },
  searchCard: { backgroundColor: '#fff', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '0.65rem 1rem' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1C1C1E', backgroundColor: 'transparent' },
  empty: { backgroundColor: '#fff', borderRadius: '14px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '480px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
  textarea: { width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#1C1C1E', boxSizing: 'border-box' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  btnEnviar: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
}