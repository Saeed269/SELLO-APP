import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { num: '1', titulo: 'El negocio se registra', desc: 'Crea tu cuenta y configura tu tarjeta de fidelización' },
  { num: '2', titulo: 'El cliente escanea el QR', desc: 'El cliente escanea el QR de tu negocio desde su móvil' },
  { num: '3', titulo: 'Se genera la tarjeta', desc: 'El cliente recibe su tarjeta digital guardada en el móvil' },
  { num: '4', titulo: 'Sellos hasta el premio', desc: 'Añades sellos en cada visita hasta completar la tarjeta' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos') }
    else { navigate('/negocio/dashboard') }
    setLoading(false)
  }

  return (
    <div style={styles.root}>

      {/* Panel izquierdo */}
      {!isMobile && (
        <div style={styles.left}>
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
            <h1 style={styles.logoText}>SELLO</h1>
            <p style={styles.tagline}>Fidelización digital para tu negocio</p>
            <p style={styles.comoFunciona}>¿Cómo funciona?</p>
            <div style={styles.pasosList}>
              {pasos.map((p, i) => (
                <div key={i} style={styles.pasoCard}>
                  <div style={styles.pasoNum}>{p.num}</div>
                  <div>
                    <p style={styles.pasoTitulo}>{p.titulo}</p>
                    <p style={styles.pasoDesc}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Panel derecho */}
      <div style={styles.right}>
        <div style={styles.formWrap}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E8763A', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
            </div>
          )}

          <h2 style={styles.titulo}>Bienvenido a Sello</h2>

          <form onSubmit={handleLogin} style={styles.form}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p style={styles.linkText}>
            ¿No tienes cuenta?{' '}
            <Link to="/negocio/register" style={styles.link}>Regístrate gratis</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

const styles = {
  root: { display: 'flex', minHeight: '100dvh' },
  left: {
    flex: 1,
    background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '3rem 2.5rem',
  },
  blob1: { position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', top: -80, right: -80 },
  blob2: { position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', bottom: -50, left: -50 },
  logoText: { margin: '0 0 0.25rem', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' },
  tagline: { margin: '0 0 1.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' },
  comoFunciona: { margin: '0 0 0.75rem', color: '#fff', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' },
  pasosList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  pasoCard: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
    padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.18)',
  },
  pasoNum: {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(255,255,255,0.3)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: '700', color: '#fff',
  },
  pasoTitulo: { margin: '0 0 2px', fontSize: '0.85rem', fontWeight: '600', color: '#fff' },
  pasoDesc: { margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 },
  right: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem 1.5rem', backgroundColor: '#f9f9f9',
  },
  formWrap: {
    width: '100%', maxWidth: '360px', backgroundColor: '#fff',
    borderRadius: '20px', padding: '2.5rem 2rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  titulo: { margin: '0 0 1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1C1C1E' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.95rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box',
  },
  error: { color: '#dc2626', fontSize: '0.85rem', margin: 0 },
  button: {
    padding: '0.9rem', backgroundColor: '#E8763A', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', width: '100%',
  },
  linkText: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#888' },
  link: { color: '#E8763A', fontWeight: '600', textDecoration: 'none' },
}