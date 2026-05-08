import { useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'
import LoadingScreen from '../../components/ui/LoadingScreen'
import { COLORS } from '../../constants'

export default function LoginCliente() {
  const [searchParams] = useSearchParams()
  const negocioId      = searchParams.get('negocio')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos'); setLoading(false); return }
    navigate(`/cliente/tarjeta?negocio=${negocioId}`)
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={s.root}>
      <div style={s.card}>
        <h1 style={s.logo}>SELLO</h1>
        <h2 style={s.titulo}>Ver mis sellos</h2>
        <p style={s.subtitulo}>Inicia sesión para acceder a tu tarjeta</p>

        <form onSubmit={handleLogin} style={s.form}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={s.input} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={s.input} required />
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.button}>Ver mis sellos</button>
        </form>

        <p style={s.linkText}>
          ¿No tienes cuenta?{' '}
          <span onClick={() => navigate(`/cliente/registro?negocio=${negocioId}`)} style={s.link}>Regístrate</span>
        </p>
      </div>
    </div>
  )
}

const s = {
  root:     { minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#f9fafb' },
  card:     { width: '100%', maxWidth: '360px', backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', textAlign: 'center' },
  logo:     { fontSize: '1.8rem', fontWeight: 'bold', color: COLORS.primary, margin: '0 0 1.25rem', letterSpacing: '0.1em' },
  titulo:   { margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: '700', color: '#1C1C1E', textAlign: 'left' },
  subtitulo:{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#888', textAlign: 'left' },
  form:     { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input:    { padding: '0.78rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa', color: '#1C1C1E', width: '100%', boxSizing: 'border-box' },
  error:    { color: COLORS.danger, fontSize: '0.82rem', margin: 0 },
  button:   { padding: '0.85rem', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer', width: '100%' },
  linkText: { textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' },
  link:     { color: COLORS.primary, fontWeight: '600', cursor: 'pointer' },
}