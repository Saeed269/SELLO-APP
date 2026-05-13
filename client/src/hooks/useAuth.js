import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { negociosApi } from '../api'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/negocio/login')
        return
      }

      // Obtenemos el token JWT para autenticarnos con el backend
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      try {
        const negocios = await negociosApi.getAll(token)
        const negocioData = negocios[0] || null

        if (!mounted) return

        if (!negocioData) {
          navigate('/negocio/onboarding')
          return
        }

        setUser(user)
        setNegocio(negocioData)
        setLoading(false)
      } catch (err) {
        console.error('Error obteniendo negocio:', err.message)
        navigate('/negocio/login')
      }
    }

    init()
    return () => { mounted = false }
  }, [navigate])

  return { user, negocio, loading, setNegocio }
}