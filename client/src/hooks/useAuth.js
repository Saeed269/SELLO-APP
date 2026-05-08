import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'


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

      const { data: negocioData } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!mounted) return

      if (!negocioData) {
        navigate('/negocio/onboarding')
        return
      }

      setUser(user)
      setNegocio(negocioData)
      setLoading(false)
    }

    init()
    return () => { mounted = false }
  }, [navigate])

  return { user, negocio, loading, setNegocio }
}