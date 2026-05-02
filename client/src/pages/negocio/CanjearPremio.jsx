import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'

const MARRON = '#E65100'

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
      if (!user) { navigate('/negocio/login'); return }

      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('user_id', user.id).single()
      setNegocio(negocioData)

      const { data: tarjetaData } = await supabase
        .from('tarjetas').select('*').eq('id', tarjetaId).single()
      setTarjeta(tarjetaData)

      if (tarjetaData) {
        const { data: clienteData } = await supabase
          .from('clientes').select('*').eq('id', tarjetaData.cliente_id).single()
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
      .update({ sellos_actuales: 0, total_canjes: (tarjeta.total_canjes || 0) + 1 })
      .eq('id', tarjetaId)
    if (error) { setError('Error al canjear: ' + error.message); setLoading(false) }
    else { setCanjeado(true); setLoading(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #bf360c 0%, #E65100 60%, #d4380a 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
    </div>
  )

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.logo}>SELLO</h1>
        <button onClick={() => navigate('/negocio/dashboard')} style={s.backBtn}>← Dashboard</button>
      </div>

      <div style={s.content}>
        {canjeado ? (
          <div style={s.successCard}>
            <p style={s.icon}>🎉</p>
            <h2 style={{ fontSize: '1.5rem', color: '#166534', margin: '0 0 0.5rem' }}>¡Premio canjeado!</h2>
            <p style={{ color: '#555', marginBottom: '0.5rem' }}>
              El contador de <strong>{cliente?.nombre}</strong> ha vuelto a 0.
            </p>
            <p style={{ color: MARRON, fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{negocio?.premio}</p>
            <button onClick={() => navigate('/negocio/escanear')} style={s.button}>Escanear otro cliente</button>
          </div>
        ) : (
          <div style={s.card}>
            <p style={s.icon}>🏆</p>
            <h2 style={{ fontSize: '1.5rem', color: '#1C1C1E', margin: '0 0 0.5rem' }}>Canjear premio</h2>
            <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: '1.5rem' }}>{cliente?.nombre}</p>
            <div style={s.premioBox}>
              <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Premio</p>
              <p style={{ color: MARRON, fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>{negocio?.premio}</p>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Al confirmar, el contador de sellos vuelve a 0 y el cliente puede empezar de nuevo.
            </p>
            {error && <p style={{ color: '#d4380a', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
            <button onClick={handleCanjear} style={s.button} disabled={loading}>
              {loading ? 'Canjeando...' : '✓ Confirmar canje'}
            </button>
            <button onClick={() => navigate('/negocio/dashboard')} style={s.cancelBtn}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  container: { minHeight: '100dvh', backgroundColor: '#f9f5f2' },
  header: { backgroundColor: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  logo: { fontSize: '1.8rem', fontWeight: 'bold', color: '#E65100', margin: 0, letterSpacing: '0.1em' },
  backBtn: { padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1.5px solid #E65100', borderRadius: '8px', color: '#E65100', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
  content: { maxWidth: '440px', margin: '3rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  successCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '2px solid #4ADE80' },
  icon: { fontSize: '3rem', margin: '0 0 0.5rem' },
  premioBox: { backgroundColor: '#FDF5EE', borderRadius: '12px', padding: '1rem 2rem', marginBottom: '1.5rem', border: `2px solid ${MARRON}44`, width: '100%', boxSizing: 'border-box' },
  button: { padding: '0.85rem', backgroundColor: '#E65100', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '0.75rem' },
  cancelBtn: { padding: '0.75rem', backgroundColor: 'transparent', color: '#888', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.95rem', cursor: 'pointer', width: '100%' },
}