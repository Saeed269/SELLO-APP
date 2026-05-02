import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', titulo: 'El negocio se registra', desc: 'Crea tu cuenta y configura tu tarjeta de fidelización en minutos' },
  { icon: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10', titulo: 'El cliente escanea el QR', desc: 'Tu cliente escanea el QR del negocio desde su móvil' },
  { icon: 'M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z M3 22v-1a9 9 0 0 1 18 0v1', titulo: 'Se genera la tarjeta', desc: 'El cliente recibe su tarjeta digital y comienza a acumular sellos' },
  { icon: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', titulo: 'Ganan haste el premio', desc: 'Acumula sellos en cada compra y consigue tu recompensa' },
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
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
            <h1 style={s.logoText}>SELLO</h1>
            <p style={s.tagline}>Fidelización digital para tu negocio</p>
            <p style={s.secLabel}>¿Cómo funciona?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pasos.map((p, i) => (
                <div key={i} style={s.pasoCard}>
                  <div style={s.pasoIconWrap}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.icon} />
                    </svg>
                  </div>
                  <div>
                    <p style={s.pasoTitulo}>{p.titulo}</p>
                    <p style={s.pasoDesc}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: '2rem 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>© 2026 SELLO. Todos los derechos reservados.</p>
          </div>
        </div>
      )}

      {/* Panel derecho */}
      <div style={s.right}>
        <div style={s.formWrap}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E8763A', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
            </div>
          )}

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
                <Link to="/negocio/reset-password" style={{ fontSize: '0.78rem', color: '#E8763A', textDecoration: 'none', fontWeight: '500' }}>¿Olvidaste tu contraseña?</Link>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={s.input} required />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <button type="submit" style={s.button} disabled={loading}>
              {loading ? 'Entrando...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Entrar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#888' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/negocio/register" style={{ color: '#E8763A', fontWeight: '600', textDecoration: 'none' }}>Regístrate gratis</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#bbb', lineHeight: 1.5 }}>
            Al continuar, aceptas nuestros{' '}
            <Link to="/terminos" style={{ color: '#E8763A', textDecoration: 'none' }}>Términos de Servicio</Link>
            {' '}y{' '}
            <Link to="/privacidad" style={{ color: '#E8763A', textDecoration: 'none' }}>Política de Privacidad</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh' },
  left: {
    width: '45%',
    flexShrink: 0,
    background: 'linear-gradient(160deg, #c03a06 0%, #E8763A 50%, #d4520f 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '3rem 2.5rem',
  },
  blob1: { position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -100, right: -100, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -60, left: -60, pointerEvents: 'none' },
  logoText: { margin: '0 0 0.25rem', fontSize: '2.8rem', fontWeight: '900', color: '#fff', letterSpacing: '0.1em' },
  tagline: { margin: '0 0 2rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' },
  secLabel: { margin: '0 0 0.75rem', color: '#fff', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em' },
  pasoCard: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    background: 'rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(4px)',
  },
  pasoIconWrap: {
    width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
    background: 'rgba(255,255,255,0.2)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  pasoTitulo: { margin: '0 0 2px', fontSize: '0.85rem', fontWeight: '700', color: '#fff' },
  pasoDesc: { margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 },
  right: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem 2.5rem', backgroundColor: '#f5f5f5',
  },
  formWrap: {
    width: '100%', maxWidth: '380px',
    padding: '0',
  },
  titulo: { margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1C1C1E' },
  subtitulo: { margin: '0.35rem 0 0', fontSize: '0.88rem', color: '#888' },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #E5E7EB',
    fontSize: '0.95rem', outline: 'none', backgroundColor: '#fff',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  button: {
    padding: '0.9rem', backgroundColor: '#E8763A', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
    width: '100%', marginTop: '0.25rem',
  },
}