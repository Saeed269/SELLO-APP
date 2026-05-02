import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { num: '1', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', titulo: 'El negocio se registra', desc: 'Crea tu cuenta y configura tu tarjeta de fidelización en minutos' },
  { num: '2', icon: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10', titulo: 'El cliente escanea el QR', desc: 'Tu cliente escanea el QR del negocio desde su móvil' },
  { num: '3', icon: 'M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z M3 22v-1a9 9 0 0 1 18 0v1', titulo: 'Se genera la tarjeta', desc: 'El cliente recibe su tarjeta digital y comienza a acumular sellos' },
  { num: '4', icon: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', titulo: 'Ganan haste el premio', desc: 'Acumula sellos en cada compra y consigue tu recompensa' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
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
    <div style={s.root}>

      {/* Panel izquierdo */}
      {!isMobile && (
        <div style={s.left}>
          <div style={s.blob1} />
          <div style={s.blob2} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
            <h1 style={s.logoText}>SELLO</h1>
            <p style={s.tagline}>Fidelización digital para tu negocio</p>
            <p style={s.secLabel}>¿Cómo funciona?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pasos.map((p) => (
                <div key={p.num} style={s.pasoCard}>
                  <div style={s.pasoNumWrap}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>{p.num}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path d={p.icon} />
                    </svg>
                    <div>
                      <p style={s.pasoTitulo}>{p.titulo}</p>
                      <p style={s.pasoDesc}>{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: '2rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>© 2026 SELLO. Todos los derechos reservados.</p>
          </div>
        </div>
      )}

      {/* Panel derecho */}
      <div style={s.right}>
        {isMobile && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E8763A', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
          </div>
        )}

        <div style={s.card}>
          <h2 style={s.titulo}>Bienvenido</h2>
          <p style={s.subtitulo}>Inicia sesión para gestionar tu negocio</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <label style={s.label}>Correo electrónico</label>
              <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={s.input} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={s.label}>Contraseña</label>
                <span style={{ fontSize: '0.78rem', color: '#E8763A', fontWeight: '500', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={s.input} required />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <button type="submit" style={s.button} disabled={loading}>
              {loading ? 'Entrando...' : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Entrar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#888' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/negocio/register" style={{ color: '#E8763A', fontWeight: '600', textDecoration: 'none' }}>Regístrate gratis</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#aaa', lineHeight: 1.6 }}>
          Al continuar, aceptas nuestros{' '}
          <span style={{ color: '#E8763A', cursor: 'pointer' }}>Términos de Servicio</span>
          {' '}y{' '}
          <span style={{ color: '#E8763A', cursor: 'pointer' }}>Política de Privacidad</span>
        </p>
      </div>

    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh' },
  left: {
    width: '50%',
    flexShrink: 0,
    background: 'linear-gradient(170deg, #E8763A 0%, #d4520f 50%, #b03000 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '3rem 2.5rem',
  },
  blob1: { position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -80, right: -80, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -50, left: -50, pointerEvents: 'none' },
  logoText: { margin: '0 0 0.2rem', fontSize: '2.8rem', fontWeight: '900', color: '#fff', letterSpacing: '0.08em' },
  tagline: { margin: '0 0 2rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' },
  secLabel: { margin: '0 0 0.75rem', color: '#fff', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em' },
  pasoCard: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
    padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.12)',
  },
  pasoNumWrap: {
    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(255,255,255,0.25)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  pasoTitulo: { margin: '0 0 2px', fontSize: '0.83rem', fontWeight: '700', color: '#fff' },
  pasoDesc: { margin: 0, fontSize: '0.73rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 },
  right: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '2rem 3rem', backgroundColor: '#f0f0f0',
  },
  card: {
    width: '100%', maxWidth: '360px', backgroundColor: '#fff',
    borderRadius: '16px', padding: '2.5rem 2rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  titulo: { margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#1C1C1E' },
  subtitulo: { margin: '0.35rem 0 0', fontSize: '0.85rem', color: '#888' },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #E5E7EB',
    fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box',
  },
  button: {
    padding: '0.9rem', backgroundColor: '#E8763A', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', width: '100%',
  },
}