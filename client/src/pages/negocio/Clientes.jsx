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
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [añadiendo, setAñadiendo] = useState(false)
  const [exito, setExito] = useState(false)
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

      await cargarClientes(negocioData.id)
      setLoading(false)
    }
    init()
  }, [navigate])

  const cargarClientes = async (negocioId) => {
    const { data } = await supabase
      .from('tarjetas')
      .select('*, clientes(nombre, email)')
      .eq('negocio_id', negocioId)
      .order('updated_at', { ascending: false })
    setClientes(data || [])
  }

  const handleAñadirSello = async () => {
    if (!clienteSeleccionado) return
    setAñadiendo(true)

    const nuevosSellos = (clienteSeleccionado.sellos_actuales || 0) + 1
    const { error } = await supabase
      .from('tarjetas')
      .update({ sellos_actuales: nuevosSellos })
      .eq('id', clienteSeleccionado.id)

    if (!error) {
      setClienteSeleccionado(prev => ({ ...prev, sellos_actuales: nuevosSellos }))
      setClientes(prev => prev.map(c =>
        c.id === clienteSeleccionado.id ? { ...c, sellos_actuales: nuevosSellos } : c
      ))
      setExito(true)
      setTimeout(() => setExito(false), 2000)
    }

    setConfirmando(false)
    setAñadiendo(false)
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

          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={s.titulo}>Clientes</h1>
            <p style={s.subtitulo}>{clientes.length} clientes registrados</p>
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

          {/* Lista */}
          {clientesFiltrados.length === 0 ? (
            <div style={s.empty}>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                {busqueda ? 'No se encontraron clientes' : 'Aún no tienes clientes registrados'}
              </p>
            </div>
          ) : (
            <div style={s.lista}>
              {clientesFiltrados.map(tarjeta => {
                const progreso = Math.min((tarjeta.sellos_actuales / negocio.num_sellos) * 100, 100)
                const premioGanado = tarjeta.sellos_actuales >= negocio.num_sellos
                return (
                  <button
                    key={tarjeta.id}
                    onClick={() => setClienteSeleccionado(tarjeta)}
                    style={s.clienteCard}
                  >
                    {/* Avatar */}
                    <div style={{ ...s.avatar, backgroundColor: premioGanado ? '#FFD700' : NARANJA }}>
                      <span style={{ color: premioGanado ? '#1C1C1E' : '#fff', fontWeight: '700', fontSize: '1rem' }}>
                        {tarjeta.clientes?.nombre?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <p style={s.clienteNombre}>{tarjeta.clientes?.nombre || 'Sin nombre'}</p>
                        {premioGanado && (
                          <span style={s.premioBadge}>🏆 Premio listo</span>
                        )}
                      </div>
                      <p style={s.clienteEmail}>{tarjeta.clientes?.email}</p>

                      {/* Barra de progreso */}
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={s.sellosLabel}>{tarjeta.sellos_actuales} / {negocio.num_sellos} sellos</span>
                          <span style={s.fechaLabel}>{formatFecha(tarjeta.updated_at)}</span>
                        </div>
                        <div style={s.barraFondo}>
                          <div style={{ ...s.barraProgreso, width: `${progreso}%`, backgroundColor: premioGanado ? '#FFD700' : NARANJA }} />
                        </div>
                      </div>
                    </div>

                    {/* Flecha */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal detalle cliente */}
      {clienteSeleccionado && (
        <div style={s.overlay} onClick={() => { setClienteSeleccionado(null); setConfirmando(false); setExito(false) }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>

            {/* Header modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ ...s.avatar, backgroundColor: NARANJA }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>
                    {clienteSeleccionado.clientes?.nombre?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: '#1C1C1E' }}>{clienteSeleccionado.clientes?.nombre}</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#888' }}>{clienteSeleccionado.clientes?.email}</p>
                </div>
              </div>
              <button onClick={() => { setClienteSeleccionado(null); setConfirmando(false); setExito(false) }} style={s.cerrarBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Sellos */}
            <div style={s.sellosWrap}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#888' }}>PROGRESO</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: NARANJA }}>
                  {clienteSeleccionado.sellos_actuales} / {negocio.num_sellos}
                </span>
              </div>
              <div style={s.barraFondo}>
                <div style={{
                  ...s.barraProgreso,
                  width: `${Math.min((clienteSeleccionado.sellos_actuales / negocio.num_sellos) * 100, 100)}%`,
                  backgroundColor: clienteSeleccionado.sellos_actuales >= negocio.num_sellos ? '#FFD700' : NARANJA,
                  transition: 'width 0.3s ease',
                }} />
              </div>

              {/* Grid sellos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '1rem' }}>
                {Array.from({ length: negocio.num_sellos }).map((_, i) => {
                  const marcado = i < clienteSeleccionado.sellos_actuales
                  return (
                    <div key={i} style={{
                      aspectRatio: '1', borderRadius: '50%',
                      backgroundColor: marcado ? NARANJA : '#f0f0f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {marcado && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Premio */}
            {negocio.premio && (
              <div style={s.premioWrap}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#888' }}>Premio</p>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#1C1C1E' }}>{negocio.premio}</p>
              </div>
            )}

            {/* Éxito */}
            {exito && (
              <div style={s.exitoMsg}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span style={{ fontSize: '0.88rem', color: '#2D6A4F', fontWeight: '500' }}>Sello añadido correctamente</span>
              </div>
            )}

            {/* Botones */}
            {!confirmando ? (
              <button
                onClick={() => setConfirmando(true)}
                disabled={clienteSeleccionado.sellos_actuales >= negocio.num_sellos}
                style={{
                  ...s.btnAñadir,
                  opacity: clienteSeleccionado.sellos_actuales >= negocio.num_sellos ? 0.5 : 1,
                  cursor: clienteSeleccionado.sellos_actuales >= negocio.num_sellos ? 'not-allowed' : 'pointer',
                }}
              >
                + Añadir sello
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#555', textAlign: 'center' }}>
                  ¿Confirmas añadir un sello a <strong>{clienteSeleccionado.clientes?.nombre}</strong>?
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setConfirmando(false)} style={s.btnCancelar}>Cancelar</button>
                  <button onClick={handleAñadirSello} disabled={añadiendo} style={s.btnAñadir}>
                    {añadiendo ? 'Añadiendo...' : '✓ Confirmar'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 700, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
    backgroundColor: '#fff', borderRadius: '12px', padding: '0.75rem 1rem',
    border: '1.5px solid #e8e8e8', marginBottom: '1rem',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem',
    color: '#1C1C1E', backgroundColor: 'transparent',
  },
  empty: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '3rem',
    textAlign: 'center', border: '1.5px solid #e8e8e8',
  },
  lista: { display: 'flex', flexDirection: 'column', gap: '8px' },
  clienteCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    backgroundColor: '#fff', borderRadius: '16px', padding: '1rem',
    border: '1.5px solid #e8e8e8', cursor: 'pointer', textAlign: 'left',
    transition: 'border-color 0.15s', width: '100%',
  },
  avatar: {
    width: 44, height: 44, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  clienteNombre: { margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#1C1C1E' },
  clienteEmail: { margin: 0, fontSize: '0.78rem', color: '#888' },
  sellosLabel: { fontSize: '0.75rem', color: '#888' },
  fechaLabel: { fontSize: '0.75rem', color: '#bbb' },
  premioBadge: {
    fontSize: '0.72rem', fontWeight: '600', color: '#92400e',
    backgroundColor: '#FEF3C7', borderRadius: '20px', padding: '2px 8px',
  },
  barraFondo: { height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' },
  barraProgreso: { height: '100%', borderRadius: '3px', transition: 'width 0.3s ease' },
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '24px 24px 0 0',
    padding: '1.5rem', width: '100%', maxWidth: '480px',
    boxShadow: '0 -8px 32px rgba(0,0,0,0.15)', maxHeight: '90dvh', overflowY: 'auto',
  },
  cerrarBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center',
  },
  sellosWrap: {
    backgroundColor: '#f9f9f9', borderRadius: '14px',
    padding: '1rem', marginBottom: '1rem',
  },
  premioWrap: {
    backgroundColor: '#FFF4EE', borderRadius: '12px',
    padding: '0.75rem 1rem', marginBottom: '1rem',
    border: '1px solid #E8763A33',
  },
  exitoMsg: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#ECFDF5', borderRadius: '10px',
    padding: '0.65rem 1rem', marginBottom: '0.75rem',
    border: '1px solid #6ee7b733',
  },
  btnAñadir: {
    width: '100%', padding: '0.9rem', backgroundColor: NARANJA,
    color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', flex: 1,
  },
  btnCancelar: {
    flex: 1, padding: '0.9rem', backgroundColor: 'transparent',
    color: '#888', border: '1.5px solid #e8e8e8', borderRadius: '12px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
  },
}