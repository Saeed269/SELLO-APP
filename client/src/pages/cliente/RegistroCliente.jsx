import { useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'
import LoadingScreen from '../../components/ui/LoadingScreen'
import { COLORS } from '../../constants'

export default function RegistroCliente() {
  const [searchParams] = useSearchParams()
  const negocioId      = searchParams.get('negocio')
  const [nombre,   setNombre]   = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError('Error al registrarse: ' + authError.message); setLoading(false); return }

    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes').insert({ user_id: authData.user.id, nombre, email }).select().single()
    if (clienteError) { setError('Error al guardar cliente: ' + clienteError.message); setLoading(false); return }

    const { error: tarjetaError } = await supabase
      .from('tarjetas').insert({ cliente_id: clienteData.id, negocio_id: negocioId, sellos_actuales: 0 })
    if (tarjetaError) { setError('Error al crear tarjeta: ' + tarjetaError.message); setLoading(false); return }

    navigate(`/cliente/tarjeta?negocio=${negocioId}`)
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={s.root}>
      <div style={s.card}>
        <h1 style={s.logo}>SELLO</h1>
        <h2 style={s.titulo}>Crea tu tarjeta</h2>
        <p style={s.subtitulo}>Acumula sellos y gana premios</p>

        <form onSubmit={handleRegistro} style={s.form}>
          <input type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={s.input} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={s.input} required />
          <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} style={s.input} required />
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.button}>Empezar a acumular sellos</button>
        </form>

        <p style={s.linkText}>
          ¿Ya tienes cuenta?{' '}
          <span onClick={() => navigate(`/cliente/login?negocio=${negocioId}`)} style={s.link}>Inicia sesión</span>
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