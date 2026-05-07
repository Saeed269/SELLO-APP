import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'

export default function EscanerQR() {
  const [escaneando, setEscaneando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [negocio, setNegocio] = useState(null)
  const scannerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      const { data } = await supabase
        .from('negocios').select('*').eq('user_id', user.id).single()
      setNegocio(data)
    }
    init()
  }, [navigate])

  const procesarQR = useCallback(async (url) => {
    setLoading(true)
    setError('')

    try {
      const urlObj = new URL(url)
      const tarjetaId = urlObj.searchParams.get('tarjeta')

      if (!tarjetaId) { setError('QR no válido'); setLoading(false); return }

      const { data: tarjeta, error: tarjetaError } = await supabase
        .from('tarjetas').select('*, clientes(nombre)').eq('id', tarjetaId).single()

      if (tarjetaError || !tarjeta) { setError('Tarjeta no encontrada'); setLoading(false); return }

      if (tarjeta.negocio_id !== negocio?.id) {
        setError('Esta tarjeta no pertenece a tu negocio')
        setLoading(false)
        return
      }

      // Si el cliente tiene premio ganado, ir directo a canjear
      if (tarjeta.sellos_actuales >= negocio?.num_sellos) {
        navigate(`/negocio/canjear?tarjeta=${tarjetaId}`)
        return
      }

      setResultado(tarjeta)
      setLoading(false)
    } catch (_) {
      setError('QR no válido')
      setLoading(false)
    }
  }, [negocio, navigate])

  const iniciarEscaner = useCallback(() => {
    setError('')
    setResultado(null)
    setEscaneando(true)

    setTimeout(() => {
      const html5Qrcode = new Html5Qrcode('reader')
      scannerRef.current = html5Qrcode

      html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 280, height: 280 } },
        async (decodedText) => {
          await html5Qrcode.stop()
          setEscaneando(false)
          await procesarQR(decodedText)
        },
        () => {}
      ).catch(() => {
        setError('No se puede acceder a la cámara')
        setEscaneando(false)
      })
    }, 300)
  }, [procesarQR])

  useEffect(() => {
    if (!negocio) return
    const timer = setTimeout(() => iniciarEscaner(), 200)
    return () => clearTimeout(timer)
  }, [negocio, iniciarEscaner])

  const detenerEscaner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {})
    }
    setEscaneando(false)
    navigate('/negocio/dashboard')
  }

  const añadirSello = async () => {
    if (!resultado) return
    setLoading(true)
    const nuevosSellos = (resultado.sellos_actuales || 0) + 1
    const { error } = await supabase
      .from('tarjetas').update({ sellos_actuales: nuevosSellos }).eq('id', resultado.id)
    if (error) {
      setError('Error al añadir sello: ' + error.message)
    } else {
      setResultado({ ...resultado, sellos_actuales: nuevosSellos })
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {escaneando && (
          <div style={styles.scannerContainer}>
            <div id="reader" style={{ width: '100%' }} />
            <button onClick={detenerEscaner} style={styles.stopBtn}>Cancelar</button>
          </div>
        )}

        {!escaneando && !resultado && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
            <div style={{ width: 48, height: 48, border: '4px solid #f0f0f0', borderTop: '4px solid #E65100', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#888', fontSize: '0.95rem', margin: 0 }}>Iniciando cámara...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {loading && <p style={styles.loadingText}>Procesando...</p>}

        {error && (
          <div style={styles.errorCard}>
            <p style={styles.errorText}>{error}</p>
            <button onClick={() => { setError(''); iniciarEscaner() }} style={styles.retryBtn}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {resultado && (
          <div style={styles.resultCard}>
            <h3 style={styles.clienteNombre}>{resultado.clientes?.nombre || 'Cliente'}</h3>
            <p style={styles.sellosTexto}>
              Sellos: <strong style={{ color: '#E65100' }}>{resultado.sellos_actuales} / {negocio?.num_sellos}</strong>
            </p>

            <div style={styles.sellosGrid}>
              {Array.from({ length: negocio?.num_sellos || 10 }).map((_, i) => (
                <div key={i} style={{
                  ...styles.sello,
                  backgroundColor: i < resultado.sellos_actuales ? '#E65100' : '#f0f0f0',
                }}>
                  {i < resultado.sellos_actuales && (
                    <span style={{ color: '#fff', fontSize: '0.8rem' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={añadirSello} style={styles.addBtn} disabled={loading}>
              {loading ? 'Añadiendo...' : '+ Añadir sello'}
            </button>

            <button onClick={() => { setResultado(null); setError(''); iniciarEscaner() }} style={styles.nuevoBtn}>
              Escanear otro cliente
            </button>

            <button onClick={() => navigate('/negocio/dashboard')} style={{ ...styles.nuevoBtn, marginTop: '0.5rem', color: '#6B7280', borderColor: '#E5E7EB' }}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },

  content: {
    maxWidth: '500px', margin: '2rem auto', padding: '0 1rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  cargando: { color: '#888', fontSize: '1rem' },
  scannerContainer: {
    width: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1rem',
  },
  stopBtn: {
    padding: '0.7rem 1.5rem', backgroundColor: '#d4380a', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.95rem',
    fontWeight: 'bold', cursor: 'pointer',
  },
  loadingText: { color: '#888', fontSize: '1rem' },
  errorCard: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem',
    textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid #d4380a', width: '100%', boxSizing: 'border-box',
  },
  errorText: { color: '#d4380a', marginBottom: '1rem' },
  retryBtn: {
    padding: '0.7rem 1.5rem', backgroundColor: '#E65100', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.95rem',
    fontWeight: 'bold', cursor: 'pointer',
  },
  resultCard: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '100%',
    boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  clienteNombre: { fontSize: '1.3rem', color: '#1C1C1E', margin: '0 0 0.5rem 0' },
  sellosTexto: { color: '#555', marginBottom: '1rem', fontSize: '0.95rem' },
  sellosGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.5rem', marginBottom: '1.5rem', width: '100%',
  },
  sello: { aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addBtn: {
    padding: '0.85rem', backgroundColor: '#E65100', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '0.75rem',
  },
  nuevoBtn: {
    padding: '0.7rem', backgroundColor: 'transparent', color: '#E65100',
    border: '1.5px solid #E65100', borderRadius: '8px', fontSize: '0.95rem',
    fontWeight: 'bold', cursor: 'pointer', width: '100%',
  },
}