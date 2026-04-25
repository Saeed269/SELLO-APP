import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { num: '1', titulo: 'El negocio se registra', desc: 'Crea tu cuenta gratis y configura tu tarjeta de fidelización' },
  { num: '2', titulo: 'El cliente escanea el QR', desc: 'El cliente escanea el QR de tu negocio desde su móvil' },
  { num: '3', titulo: 'Se genera la tarjeta', desc: 'El cliente recibe su tarjeta digital guardada en el móvil' },
  { num: '4', titulo: 'Sellos hasta el premio', desc: 'Añades sellos en cada visita hasta completar la tarjeta' },
]

export default function Register() {
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }

    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) { setError('Error al registrarse: ' + signUpError.message); setLoading(false); return }
    if (data?.user) {
      await supabase.from('negocios').insert({ user_id: data.user.id, email, nombre: nombreNegocio })
    }
    navigate('/negocio/onboarding')
    setLoading(false)
  }

  return (
    <div style={styles.root}>
      {!isMobile && (
        <div style={styles.left}>
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380 }}>
            <h1 style={styles.logoText}>SELLO</h1>
            <p style={styles.tagline}>Empieza gratis en menos de 5 minutos</p>
            <div style={styles.pasosList}>
              {pasos.map((p, i) => (
                <div key={i} style={styles.paso}>
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

      <div style={styles.right}>
        <div style={styles.formWrap}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E8763A', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
            </div>
          )}

          <h2 style={styles.titulo}>Crear cuenta</h2>

          <form onSubmit={handleRegister} style={styles.form}>
            <input type="text" placeholder="Nombre de tu negocio" value={nombreNegocio} onChange={e => setNombreNegocio(e.target.value)} style={styles.input} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} required />
            <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
            <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={e => setConfirm(e.target.value)} style={styles.input} required />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p style={styles.linkText}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/negocio/login" style={styles.link}>Inicia sesión</Link>
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
  logoText: { margin: '0 0 0.5rem', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' },
  tagline: { margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' },
  pasosList: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    background: 'rgba(255,255,255,0.12)', borderRadius: '16px',
    padding: '1.25rem', border: '1px solid rgba(255,255,255,0.2)',
  },
  paso: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  pasoNum: {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(255,255,255,0.3)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: '700', color: '#fff',
  },
  pasoTitulo: { margin: '0 0 2px', fontSize: '0.85rem', fontWeight: '600', color: '#fff' },
  pasoDesc: { margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 },
  right: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1.5rem', backgroundColor: '#f9f9f9',
  },
  formWrap: {
    width: '100%', maxWidth: '360px', backgroundColor: '#fff',
    borderRadius: '20px', padding: '2rem 1.75rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  titulo: { margin: '0 0 1.25rem', fontSize: '1.4rem', fontWeight: '700', color: '#1C1C1E' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: {
    padding: '0.78rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box',
  },
  error: { color: '#dc2626', fontSize: '0.82rem', margin: 0 },
  button: {
    padding: '0.85rem', backgroundColor: '#E8763A', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer',
    width: '100%',
  },
  linkText: { textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' },
  link: { color: '#E8763A', fontWeight: '600', textDecoration: 'none' },
}