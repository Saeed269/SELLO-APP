import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import LoadingScreen from '../../components/ui/LoadingScreen'
import { negociosApi, tarjetasApi } from '../../api'
import { COLORS } from '../../constants'

function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <div style={{ width: 48, height: 48, border: '4px solid #f0f0f0', borderTop: `4px solid ${COLORS.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontSize: '0.95rem', margin: 0 }}>Iniciando cámara...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ResultadoCliente({ tarjeta, maxSellos, onAñadirSello, onNuevo, onVolver, loading }) {
  const sellos       = tarjeta.sellos_actuales || 0
  const premioGanado = sellos >= maxSellos

  return (
    <div style={s.resultCard}>
      <h3 style={s.clienteNombre}>{tarjeta.clientes?.nombre || tarjeta.cliente_nombre || 'Cliente'}</h3>
      <p style={s.sellosTexto}>
        Sellos: <strong style={{ color: COLORS.primary }}>{sellos} / {maxSellos}</strong>
      </p>
      <div style={s.sellosGrid}>
        {Array.from({ length: maxSellos }).map((_, i) => (
          <div key={i} style={{ ...s.sello, backgroundColor: i < sellos ? COLORS.primary : '#f0f0f0' }}>
            {i < sellos && <span style={{ color: '#fff', fontSize: '0.8rem' }}>✓</span>}
          </div>
        ))}
      </div>
      <button onClick={onAñadirSello} disabled={loading || premioGanado}
        style={{ ...s.btnPrimary, opacity: loading || premioGanado ? 0.6 : 1 }}>
        {loading ? 'Añadiendo...' : premioGanado ? '🏆 Premio ganado' : '+ Añadir sello'}
      </button>
      <button onClick={onNuevo} style={s.btnSecondary}>Escanear otro cliente</button>
      <button onClick={onVolver} style={{ ...s.btnSecondary, marginTop: '0.5rem', color: '#6B7280', borderColor: '#E5E7EB' }}>
        Volver al inicio
      </button>
    </div>
  )
}

export default function EscanerQR() {
  const [escaneando,   setEscaneando]   = useState(false)
  const [resultado,    setResultado]    = useState(null)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [negocio,      setNegocio]      = useState(null)
  const [initLoading,  setInitLoading]  = useState(true)
  const scannerRef = useRef(null)
  const navigate   = useNavigate()

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      try {
        const token    = await getToken()
        const negocios = await negociosApi.getAll(token)
        setNegocio(negocios[0] || null)
      } catch {
        navigate('/negocio/login')
      }
      setInitLoading(false)
    }
    init()
  }, [navigate])

  const procesarQR = useCallback(async (url) => {
    setLoading(true)
    setError('')
    try {
      const urlObj    = new URL(url)
      const tarjetaId = urlObj.searchParams.get('tarjeta')
      if (!tarjetaId) { setError('QR no válido'); setLoading(false); return }

      const { data: tarjeta, error: tarjetaError } = await supabase
        .from('tarjetas').select('*, clientes(nombre)').eq('id', tarjetaId).single()

      if (tarjetaError || !tarjeta) { setError('Tarjeta no encontrada'); setLoading(false); return }
      if (tarjeta.negocio_id !== negocio?.id) { setError('Esta tarjeta no pertenece a tu negocio'); setLoading(false); return }

      if (tarjeta.sellos_actuales >= negocio?.num_sellos) {
        navigate(`/negocio/canjear?tarjeta=${tarjetaId}`)
        return
      }

      setResultado(tarjeta)
    } catch {
      setError('QR no válido')
    }
    setLoading(false)
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

  const detenerEscaner = async () => {
    if (scannerRef.current) await scannerRef.current.stop().catch(() => {})
    setEscaneando(false)
    navigate('/negocio/dashboard')
  }

  const añadirSello = async () => {
    if (!resultado) return
    setLoading(true)
    try {
      const token    = await getToken()
      const response = await tarjetasApi.addSello(token, resultado.id)
      setResultado({ ...resultado, sellos_actuales: response.tarjeta.sellos_actuales })
    } catch (err) {
      setError('Error al añadir sello: ' + err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!negocio) return
    const timer = setTimeout(() => iniciarEscaner(), 200)
    return () => clearTimeout(timer)
  }, [negocio, iniciarEscaner])

  if (initLoading) return <LoadingScreen />

  return (
    <div style={s.container}>
      <div style={s.content}>
        {escaneando && (
          <div style={s.scannerContainer}>
            <div id="reader" style={{ width: '100%' }} />
            <button onClick={detenerEscaner} style={s.btnStop}>Cancelar</button>
          </div>
        )}

        {!escaneando && !resultado && !error && <Spinner />}

        {loading && !resultado && <p style={{ color: '#888' }}>Procesando...</p>}

        {error && (
          <div style={s.errorCard}>
            <p style={{ color: COLORS.danger, marginBottom: '1rem' }}>{error}</p>
            <button onClick={() => { setError(''); iniciarEscaner() }} style={s.btnPrimary}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {resultado && (
          <ResultadoCliente
            tarjeta={resultado}
            maxSellos={negocio?.num_sellos || 10}
            onAñadirSello={añadirSello}
            onNuevo={() => { setResultado(null); setError(''); iniciarEscaner() }}
            onVolver={() => navigate('/negocio/dashboard')}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

const s = {
  container:        { minHeight: '100dvh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  content:          { maxWidth: '500px', width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  scannerContainer: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  btnStop:          { padding: '0.7rem 1.5rem', backgroundColor: COLORS.danger, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' },
  errorCard:        { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${COLORS.danger}`, width: '100%', boxSizing: 'border-box' },
  resultCard:       { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  clienteNombre:    { fontSize: '1.3rem', color: '#1C1C1E', margin: '0 0 0.5rem' },
  sellosTexto:      { color: '#555', marginBottom: '1rem', fontSize: '0.95rem' },
  sellosGrid:       { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.5rem', marginBottom: '1.5rem', width: '100%' },
  sello:            { aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnPrimary:       { padding: '0.85rem', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '0.75rem' },
  btnSecondary:     { padding: '0.7rem', backgroundColor: 'transparent', color: COLORS.primary, border: `1.5px solid ${COLORS.primary}`, borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
}