import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { NegocioContext } from './NegocioContext'

export default function NegocioProvider({ children }) {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      if (!user) { setLoading(false); return }
      setUser(user)
      supabase.from('negocios').select('*').eq('user_id', user.id).single()
        .then(({ data }) => {
          if (!mounted) return
          setNegocio(data)
          setLoading(false)
        })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT') { setUser(null); setNegocio(null) }
      if (event === 'SIGNED_IN' && session?.user) setUser(session.user)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const updateNegocio = (data) => setNegocio(prev => ({ ...prev, ...data }))

  return (
    <NegocioContext.Provider value={{ user, negocio, loading, updateNegocio }}>
      {children}
    </NegocioContext.Provider>
  )
}