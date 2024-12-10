import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/utils/supabase/component'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
        setSession(null)
      } else {
        setSession(data.session)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      
      if (event === 'SIGNED_OUT') {
        setSession(null)
        // Dispatch router push after callback
        setTimeout(() => {
          router.push('/login')
        }, 0)
      } else {
        setSession(session)
      }
    })
    
    // call unsubscribe to remove the callback
    authListener?.subscription.unsubscribe()
    
  }, [router, supabase])
  if (loading) return <p>Loading...</p>

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)