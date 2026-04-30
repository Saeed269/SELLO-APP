import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function CanjearPremio() {
  const [searchParams] = useSearchParams()
  const tarjetaId = searchParams.get('tarjeta')
  const [tarjeta, setTarjeta] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [canjeado, setCanjeado] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/negocio/login')
        return
      }

      const { data: negocioData } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setNegocio(negocioData)

      const { data: tarjetaData } = await supabase
        .from('tarjetas')
        .select('*')
        .eq('id', tarjetaId)
        .single()
      setTarjeta(tarjetaData)

      if (tarjetaData) {
        const { data: clienteData } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', tarjetaData.cliente_id)
          .single()
        setCliente(clienteData)
      }

      setLoading(false)
    }
    init()
  }, [tarjetaId, navigate])

  const handleCanjear = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('tarjetas')
      .update({
        sellos_actuales: 0,
        total_canjes: (tarjeta.total_canjes || 0) + 1,
      })
      .eq('id', tarjetaId)

    if (error) {
      setError('Error al canjear: ' + error.message)
      setLoading(false)
    } else {
      setCanjeado(true)
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Cargando...</p>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>SELLO</h1>
        <button onClick={() => navigate('/negocio/dashboard')} style={styles.backBtn}>
          ← Dashboard
        </button>
      </div>

      <div style={styles.content}>
        {canjeado ? (
          <div style={styles.successCard}>
            <p style={styles.successIcon}>🎉</p>
            <h2 style={styles.successTitle}>¡Premio canjeado!</h2>
            <p style={styles.successText}>
              El contador de <strong>{cliente?.nombre}</strong> ha vuelto a 0.
            </p>
            <p style={styles.successPremio}>{negocio?.premio}</p>
            <button
              onClick={() => navigate('/negocio/escanear')}
              style={styles.button}
            >
              Escanear otro cliente
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            <p style={styles.premioIcon}>🏆</p>
            <h2 style={styles.titulo}>Canjear premio</h2>
            <p style={styles.clienteNombre}>{cliente?.nombre}</p>
            <div style={styles.premioBox}>
              <p style={styles.premioLabel}>Premio</p>
              <p style={styles.premioValor}>{negocio?.premio}</p>
            </div>
            <p style={styles.info}>
              Al confirmar, el contador de sellos vuelve a 0 y el cliente puede empezar de nuevo.
            </p>
            {error && <p style={styles.error}>{error}</p>}
            <button
              onClick={handleCanjear}
              style={styles.button}
              disabled={loading}
            >
              {loading ? 'Canjeando...' : '✓ Confirmar canje'}
            </button>
            <button
              onClick={() => navigate('/negocio/dashboard')}
              style={styles.cancelBtn}
            >
              Cancelar
            </button>
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
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.8rem', fontWeight: 'bold', color: '#C67C3E', margin: 0 },
  backBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #C67C3E',
    borderRadius: '8px',
    color: '#C67C3E',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  content: {
    maxWidth: '440px',
    margin: '3rem auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  premioIcon: { fontSize: '3rem', margin: '0 0 0.5rem 0' },
  titulo: { fontSize: '1.5rem', color: '#1C1C1E', margin: '0 0 0.5rem 0' },
  clienteNombre: { fontSize: '1.1rem', color: '#888', marginBottom: '1.5rem' },
  premioBox: {
    backgroundColor: '#FFF0E6',
    borderRadius: '12px',
    padding: '1rem 2rem',
    marginBottom: '1.5rem',
    border: '2px solid #C67C3E',
    width: '100%',
    boxSizing: 'border-box',
  },
  premioLabel: { color: '#888', fontSize: '0.85rem', margin: '0 0 0.25rem 0' },
  premioValor: { color: '#C67C3E', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 },
  info: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' },
  error: { color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' },
  button: {
    padding: '0.85rem',
    backgroundColor: '#C67C3E',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '0.75rem',
  },
  cancelBtn: {
    padding: '0.75rem',
    backgroundColor: 'transparent',
    color: '#888',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    width: '100%',
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '2px solid #4ADE80',
  },
  successIcon: { fontSize: '3rem', margin: '0 0 0.5rem 0' },
  successTitle: { fontSize: '1.5rem', color: '#166534', margin: '0 0 0.5rem 0' },
  successText: { color: '#555', marginBottom: '0.5rem' },
  successPremio: { color: '#C67C3E', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.5rem' },
}