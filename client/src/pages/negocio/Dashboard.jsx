import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import NavNegocio from '../../components/NavNegocio'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/negocio/login')
        return
      }
      setUser(user)

      const { data } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!data) {
        navigate('/negocio/onboarding')
      } else {
        setNegocio(data)
      }
      setLoading(false)
    }
    init()
  }, [navigate])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <p style={{ color: '#888' }}>Cargando...</p>
    </div>
  )

  const qrUrl = `${window.location.origin}/cliente/registro?negocio=${negocio?.id}`

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <NavNegocio negocio={negocio} user={user} />

      {/* Contenido principal */}
      <main style={{
        ...styles.main,
        marginLeft: isMobile ? 0 : 0,
        paddingTop: isMobile ? '4rem' : '2rem',
        paddingBottom: isMobile ? '2rem' : '2rem',
      }}>
        <div style={styles.inner}>

          {/* Título */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={styles.titulo}>Inicio</h1>
            <p style={styles.subtitulo}>Bienvenido, {negocio?.nombre} 👋</p>
          </div>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'flex-start',
          }}>

            {/* Columna izquierda: tarjeta del negocio + botones */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Tarjeta del negocio con QR */}
              <div style={styles.card}>
                <p style={styles.cardLabel}>Tarjeta de tu Negocio</p>
                <div style={styles.tarjetaNegocio}>
                  {/* Info izquierda */}
                  <div style={styles.tarjetaInfo}>
                    <div style={styles.tarjetaIcono}>🏪</div>
                    <h2 style={styles.tarjetaNombre}>{negocio?.nombre}</h2>
                    <p style={styles.tarjetaTipo}>{negocio?.tipo}</p>
                    <div style={styles.tarjetaQrLabel}>
                      <p style={styles.tarjetaQrTexto}>Los clientes escanean este QR para registrarse</p>
                    </div>
                  </div>
                  {/* QR derecha */}
                  <div style={styles.tarjetaQrArea}>
                    <div style={styles.qrWrapper}>
                      <QRCodeSVG
                        value={qrUrl}
                        size={isMobile ? 110 : 140}
                        fgColor="#1C1C1E"
                        bgColor="#FFFFFF"
                        level="M"
                      />
                    </div>
                    <p style={styles.qrHint}>Muestra este QR a nuevos clientes</p>
                  </div>
                </div>
              </div>

              {/* Botones Escanear y Canjear */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '1rem',
              }}>
                <button
                  onClick={() => navigate('/negocio/escanear')}
                  style={styles.btnEscanear}
                >
                  <div style={styles.btnIconWrap}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                      <line x1="7" y1="12" x2="17" y2="12"/>
                    </svg>
                  </div>
                  <div>
                    <p style={styles.btnTitulo}>Escanear QR del Cliente</p>
                    <p style={styles.btnSub}>Añadir sello o descontar sesión</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/negocio/canjear')}
                  style={styles.btnCanjear}
                >
                  <div style={styles.btnIconWrap}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={styles.btnTitulo}>Canjear Premio</p>
                    <p style={styles.btnSub}>Cliente reclama su recompensa</p>
                  </div>
                </button>
              </div>

              {/* Rendimiento del mes */}
              <div style={styles.rendimiento}>
                <div style={styles.rendimientoIcon}>📈</div>
                <p style={styles.rendimientoTexto}>
                  <strong>Rendimiento este mes</strong><br />
                  Has tenido{' '}
                  <span style={{ color: '#E8763A', fontWeight: 600 }}>342 escaneos</span>,{' '}
                  <span style={{ color: '#1D9E75', fontWeight: 600 }}>89 nuevos clientes</span>{' '}
                  y{' '}
                  <span style={{ color: '#E8763A', fontWeight: 600 }}>45 premios canjeados</span>.{' '}
                  ¡Sigue así!
                </p>
              </div>

            </div>

            {/* Columna derecha: estadísticas de hoy (solo desktop) */}
            {!isMobile && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888', fontWeight: '500' }}>Hoy</p>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIconWrap, background: '#e6f1fb' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                      <line x1="7" y1="12" x2="17" y2="12"/>
                    </svg>
                  </div>
                  <div>
                    <p style={styles.statNum}>24</p>
                    <p style={styles.statLabel}>Escaneos</p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIconWrap, background: '#eaf3de' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <p style={styles.statNum}>8</p>
                    <p style={styles.statLabel}>Nuevos clientes</p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIconWrap, background: '#fff0e6' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={styles.statNum}>3</p>
                    <p style={styles.statLabel}>Premios canjeados</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 1.25rem',
  },
  titulo: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#1C1C1E',
    margin: '0 0 4px',
  },
  subtitulo: {
    fontSize: '0.9rem',
    color: '#888',
    margin: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1C1C1E',
    margin: '0 0 12px',
  },
  tarjetaNegocio: {
    background: 'linear-gradient(135deg, #7F77DD, #534AB7)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  tarjetaInfo: {
    flex: 1,
  },
  tarjetaIcono: {
    fontSize: '1.5rem',
    marginBottom: '8px',
  },
  tarjetaNombre: {
    margin: '0 0 4px',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
  },
  tarjetaTipo: {
    margin: '0 0 12px',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.75)',
  },
  tarjetaQrLabel: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '8px',
    padding: '8px 12px',
    maxWidth: 220,
  },
  tarjetaQrTexto: {
    margin: 0,
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.9)',
  },
  tarjetaQrArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  qrWrapper: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '10px',
  },
  qrHint: {
    margin: 0,
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  btnEscanear: {
    background: 'linear-gradient(135deg, #7F77DD, #534AB7)',
    border: 'none',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    textAlign: 'left',
  },
  btnCanjear: {
    background: 'linear-gradient(135deg, #E8763A, #d4662a)',
    border: 'none',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    textAlign: 'left',
  },
  btnIconWrap: {
    width: 48,
    height: 48,
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  btnTitulo: {
    margin: '0 0 3px',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
  },
  btnSub: {
    margin: 0,
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.8)',
  },
  rendimiento: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  rendimientoIcon: {
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  rendimientoTexto: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#555',
    lineHeight: 1.6,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '0.9rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statNum: {
    margin: '0 0 2px',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statLabel: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#888',
  },
}