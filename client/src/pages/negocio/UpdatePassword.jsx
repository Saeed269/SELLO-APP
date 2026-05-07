import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passFocus, setPassFocus] = useState(false)
  const [confirmFocus, setConfirmFocus] = useState(false)
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError('Error: ' + error.message) }
    else { navigate('/negocio/dashboard') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', fontFamily: 'Inter, system-ui, sans-serif', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>Nueva contraseña</h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6B7280' }}>Elige una nueva contraseña para tu cuenta</p>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nueva contraseña</label>
            <input
              type="password" placeholder="Mínimo 6 caracteres" value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)}
              style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: passFocus ? '2px solid #E65100' : '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff', color: '#111827', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirmar contraseña</label>
            <input
              type="password" placeholder="Repite la contraseña" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onFocus={() => setConfirmFocus(true)} onBlur={() => setConfirmFocus(false)}
              style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: confirmFocus ? '2px solid #E65100' : '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff', color: '#111827', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              required
            />
          </div>

          {error && <p style={{ color: '#d4380a', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ padding: '0.9rem', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #E65100, #bf360c)', color: '#fff', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(230,81,0,0.35)' }}>
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}