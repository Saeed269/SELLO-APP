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

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    navigate(`/cliente/tarjeta?negocio=${negocioId}`)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>SELLO</h1>
        <p style={styles.subtitle}>Inicia sesión para ver tus sellos</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Ver mis sellos'}
          </button>
        </form>

        <p style={styles.register}>
          ¿No tienes cuenta?{' '}
          <span
            style={styles.registerLink}
            onClick={() => navigate(`/cliente/registro?negocio=${negocioId}`)}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#E8763A',
    textAlign: 'center',
    margin: '0 0 0.25rem 0',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    fontSize: '1rem',
    outline: 'none',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.9rem',
    margin: 0,
  },
  button: {
    padding: '0.85rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  register: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  registerLink: {
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}