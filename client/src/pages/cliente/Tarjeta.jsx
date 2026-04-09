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
  const [cara, setCara] = useState('frente')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate(`/cliente/login?negocio=${negocioId}`)
        return
      }

      // Cargar datos del cliente
      const { data: clienteData } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setCliente(clienteData)

      // Cargar datos del negocio
      const { data: negocioData } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', negocioId)
        .single()
      setNegocio(negocioData)

      // Cargar tarjeta
      const { data: tarjetaData } = await supabase
        .from('tarjetas')
        .select('*')
        .eq('cliente_id', clienteData.id)
        .eq('negocio_id', negocioId)
        .single()
      setTarjeta(tarjetaData)

      setLoading(false)
    }
    init()
  }, [negocioId, navigate])

  // Suscripción en tiempo real a los sellos
  useEffect(() => {
    if (!tarjeta) return

    const channel = supabase
      .channel('tarjeta-cambios')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tarjetas',
        filter: `id=eq.${tarjeta.id}`,
      }, (payload) => {
        setTarjeta(payload.new)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [tarjeta?.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate(`/cliente/login?negocio=${negocioId}`)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Cargando tu tarjeta...</p>
    </div>
  )

  const sellosActuales = tarjeta?.sellos_actuales || 0
  const totalSellos = negocio?.num_sellos || 10
  const premioGanado = sellosActuales >= totalSellos
  const qrCliente = `${window.location.origin}/negocio/escanear?tarjeta=${tarjeta?.id}`

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>SELLO</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
      </div>

      <div style={styles.content}>
        <p style={styles.bienvenido}>Hola, {cliente?.nombre} 👋</p>
        <p style={styles.negocioNombre}>{negocio?.nombre}</p>

        {/* Tarjeta con giro */}
        <div style={styles.tarjetaContainer} onClick={() => setCara(cara === 'frente' ? 'atras' : 'frente')}>
          <p style={styles.tapHint}>Toca la tarjeta para girarla</p>

          {cara === 'frente' ? (
            <div style={{ ...styles.tarjeta, backgroundColor: '#E8763A' }}>
              <p style={styles.tarjetaNombre}>{negocio?.nombre}</p>
              <p style={styles.tarjetaPremio}>Premio: {negocio?.premio}</p>

              {/* Grid de sellos */}
              <div style={styles.sellosGrid}>
                {Array.from({ length: totalSellos }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.sello,
                      backgroundColor: i < sellosActuales
                        ? (i === totalSellos - 1 ? '#FFD700' : '#FFFFFF')
                        : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {i < sellosActuales && (
                      <span style={{ fontSize: i === totalSellos - 1 ? '1rem' : '0.8rem' }}>
                        {i === totalSellos - 1 ? '★' : '✓'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <p style={styles.sellosContador}>
                {sellosActuales} / {totalSellos} sellos
              </p>
            </div>
          ) : (
            <div style={{ ...styles.tarjeta, backgroundColor: '#1C1C1E' }}>
              <p style={styles.tarjetaNombreAtras}>{cliente?.nombre}</p>
              <p style={styles.tarjetaSubAtras}>Muestra este QR para recibir tu sello</p>
              <div style={styles.qrAtras}>
                <QRCodeSVG
                  value={premioGanado
                    ? `${window.location.origin}/negocio/canjear?tarjeta=${tarjeta?.id}`
                    : qrCliente}
                  size={150}
                  fgColor="#1C1C1E"
                  bgColor="#FFFFFF"
                  level="M"
                />
              </div>
              {premioGanado && (
                <p style={styles.premioTexto}>🎉 ¡Premio listo para canjear!</p>
              )}
            </div>
          )}
        </div>

        {premioGanado && (
          <div style={styles.premioCard}>
            <p style={styles.premioCardTexto}>
              🏆 ¡Felicidades! Has ganado: <strong>{negocio?.premio}</strong>
            </p>
            <p style={styles.premioCardSub}>Gira la tarjeta y muestra el QR al negocio</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#E8763A', margin: 0 },
  logoutBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  content: {
    maxWidth: '420px',
    margin: '1.5rem auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bienvenido: { fontSize: '1.1rem', color: '#1C1C1E', margin: '0 0 0.2rem 0', fontWeight: '600' },
  negocioNombre: { fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem' },
  tarjetaContainer: { width: '100%', cursor: 'pointer' },
  tapHint: { textAlign: 'center', fontSize: '0.8rem', color: '#bbb', marginBottom: '0.5rem' },
  tarjeta: {
    width: '100%',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    minHeight: '280px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  tarjetaNombre: { color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.25rem 0' },
  tarjetaPremio: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '0 0 1.2rem 0' },
  sellosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  sello: {
    aspectRatio: '1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E8763A',
    fontWeight: 'bold',
  },
  sellosContador: { color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textAlign: 'right', margin: 0 },
  tarjetaNombreAtras: { color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.25rem 0' },
  tarjetaSubAtras: { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '0 0 1rem 0' },
  qrAtras: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    alignSelf: 'center',
  },
  premioTexto: { color: '#FFD700', fontWeight: 'bold', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
  premioCard: {
    marginTop: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.2rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid #FFD700',
    width: '100%',
    boxSizing: 'border-box',
  },
  premioCardTexto: { color: '#1C1C1E', margin: '0 0 0.5rem 0', fontSize: '0.95rem' },
  premioCardSub: { color: '#888', fontSize: '0.85rem', margin: 0 },
}