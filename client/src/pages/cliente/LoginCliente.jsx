import { useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function LoginCliente() {
  const [searchParams] = useSearchParams()
  const negocioId = searchParams.get('negocio')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos'); setLoading(false); return }

    navigate(`/cliente/tarjeta?negocio=${negocioId}`)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #3D2314 0%, #5C4033 60%, #4A2E1A 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Cargando tu tarjeta...</p>
    </div>
  )

  return (
    <div style={styles.root}>
      <div style={styles.formWrap}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={styles.logo}>SELLO</h1>
        </div>

        <h2 style={styles.titulo}>Ver mis sellos</h2>
        <p style={styles.subtitulo}>Inicia sesión para acceder a tu tarjeta</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>
            Ver mis sellos
          </button>
        </form>

        <p style={styles.linkText}>
          ¿No tienes cuenta?{' '}
          <span onClick={() => navigate(`/cliente/registro?negocio=${negocioId}`)} style={styles.link}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
  },
  formWrap: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '2rem 1.75rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#5C4033',
    margin: 0,
    letterSpacing: '0.1em',
  },
  titulo: { margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#888' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.78rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box',
  },
  error: { color: '#dc2626', fontSize: '0.82rem', margin: 0 },
  button: {
    padding: '0.85rem', backgroundColor: '#5C4033', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer',
    width: '100%', marginTop: '0.1rem',
  },
  linkText: { textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' },
  link: { color: '#5C4033', fontWeight: '600', cursor: 'pointer' },
}