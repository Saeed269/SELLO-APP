import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

export default function Tarjeta() {
  const [searchParams] = useSearchParams()
  const negocioId = searchParams.get('negocio')
  const [tarjeta, setTarjeta] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate(`/cliente/login?negocio=${negocioId}`); return }

      const { data: clienteData } = await supabase
        .from('clientes').select('*').eq('user_id', user.id).single()
      setCliente(clienteData)

      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('id', negocioId).single()
      setNegocio(negocioData)

      const { data: tarjetaData } = await supabase
        .from('tarjetas').select('*')
        .eq('cliente_id', clienteData?.id)
        .eq('negocio_id', negocioId)
        .single()
      setTarjeta(tarjetaData)

      setLoading(false)
    }
    init()
  }, [negocioId, navigate])

  useEffect(() => {
    if (!tarjeta) return
    const channel = supabase
      .channel('tarjeta-cambios')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'tarjetas',
        filter: `id=eq.${tarjeta.id}`,
      }, (payload) => setTarjeta(payload.new))
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [tarjeta])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate(`/cliente/login?negocio=${negocioId}`)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Cargando tu tarjeta...</p>
    </div>
  )

  const sellosActuales = tarjeta?.sellos_actuales || 0
  const totalSellos = negocio?.num_sellos || 10
  const premioGanado = sellosActuales >= totalSellos
  const qrCliente = premioGanado
    ? `${window.location.origin}/negocio/canjear?tarjeta=${tarjeta?.id}`
    : `${window.location.origin}/negocio/escanear?tarjeta=${tarjeta?.id}`
  const columnas = totalSellos <= 8 ? 4 : 5

  return (
    <div style={styles.root}>

      <button onClick={handleLogout} style={styles.salirBtn}>Salir</button>

      <div style={styles.tarjeta}>
        {/* Blobs */}
        <div style={{ ...styles.blob, width: 220, height: 220, top: -70, right: -70 }} />
        <div style={{ ...styles.blob, width: 140, height: 140, bottom: -50, left: -50, opacity: 0.08 }} />
        <div style={{ ...styles.blob, width: 90, height: 90, top: '40%', right: 10, background: 'rgba(255,215,0,0.12)' }} />

        {/* Header — negocio + cliente */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={styles.tipoNegocio}>{negocio?.tipo?.toUpperCase()}</p>
          <h2 style={styles.nombreNegocio}>{negocio?.nombre}</h2>
          <p style={styles.nombreCliente}>{cliente?.nombre}</p>
        </div>

        {/* Sellos */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: `repeat(${columnas}, 1fr)`,
          gap: '10px',
        }}>
          {Array.from({ length: totalSellos }).map((_, i) => {
            const marcado = i < sellosActuales
            const esUltimo = i === totalSellos - 1
            return (
              <div key={i} style={{
                aspectRatio: '1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: marcado
                  ? (esUltimo ? '#FFD700' : '#fff')
                  : 'rgba(255,255,255,0.2)',
                border: marcado ? 'none' : '1.5px solid rgba(255,255,255,0.35)',
              }}>
                {marcado && (
                  esUltimo ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )
                )}
              </div>
            )
          })}
        </div>

        {/* Contador + premio */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={styles.contador}>{sellosActuales} / {totalSellos} sellos</p>
          <div style={styles.premioBadge}>
            <p style={styles.premioText}>🎁 {negocio?.premio}</p>
          </div>
        </div>

        {/* Separador */}
        <div style={{ position: 'relative', zIndex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />

        {/* QR */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <p style={styles.qrHint}>
            {premioGanado ? '🎉 ¡Premio listo! Muestra este QR al negocio' : 'Muestra este QR para recibir tu sello'}
          </p>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={qrCliente}
              size={160}
              fgColor="#1C1C1E"
              bgColor="#FFFFFF"
              level="M"
            />
          </div>
        </div>

      </div>

    </div>
  )
}

const styles = {
  root: {
    minHeight: '100dvh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  salirBtn: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '0.8rem',
    color: '#888',
    cursor: 'pointer',
    zIndex: 100,
  },
  tarjeta: {
    width: '100%',
    maxWidth: '420px',
    background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)',
    borderRadius: '28px',
    padding: '2rem 1.75rem',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    boxShadow: '0 24px 64px rgba(192,58,6,0.3)',
    boxSizing: 'border-box',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    pointerEvents: 'none',
  },
  tipoNegocio: {
    margin: 0,
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.15em',
  },
  nombreNegocio: {
    margin: '2px 0 4px',
    fontSize: '1.75rem',
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#fff',
    fontFamily: 'Georgia, serif',
  },
  nombreCliente: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
  },
  contador: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
  },
  premioBadge: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '20px',
    padding: '5px 14px',
  },
  premioText: {
    margin: 0,
    fontSize: '12px',
    color: '#fff',
    fontWeight: '500',
  },
  qrHint: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  qrWrap: {
    background: '#fff',
    borderRadius: '16px',
    padding: '14px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
}